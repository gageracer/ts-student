
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src/components/DInput.svelte generated by Svelte v3.24.1 */

    const file = "src/components/DInput.svelte";

    function create_fragment(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			set_style(input, "background-color", /*bgColor*/ ctx[1]);
    			set_style(input, "height", /*height*/ ctx[2]);
    			attr_dev(input, "class", "svelte-1gxebcy");
    			add_location(input, file, 23, 0, 415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*inputVal*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "focus", /*onFocus*/ ctx[3], false, false, false),
    					listen_dev(input, "blur", /*onBlur*/ ctx[4], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*bgColor*/ 2) {
    				set_style(input, "background-color", /*bgColor*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 4) {
    				set_style(input, "height", /*height*/ ctx[2]);
    			}

    			if (dirty & /*inputVal*/ 1 && input.value !== /*inputVal*/ ctx[0]) {
    				set_input_value(input, /*inputVal*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { inputVal } = $$props;
    	let { bgColor } = $$props;
    	let { height } = $$props;

    	function onFocus() {
    		$$invalidate(1, bgColor = "#b4ffff");
    	}

    	function onBlur() {
    		$$invalidate(1, bgColor = "#90caf9");
    	}

    	const writable_props = ["inputVal", "bgColor", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DInput> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("DInput", $$slots, []);

    	function input_input_handler() {
    		inputVal = this.value;
    		$$invalidate(0, inputVal);
    	}

    	$$self.$$set = $$props => {
    		if ("inputVal" in $$props) $$invalidate(0, inputVal = $$props.inputVal);
    		if ("bgColor" in $$props) $$invalidate(1, bgColor = $$props.bgColor);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({
    		inputVal,
    		bgColor,
    		height,
    		onFocus,
    		onBlur
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputVal" in $$props) $$invalidate(0, inputVal = $$props.inputVal);
    		if ("bgColor" in $$props) $$invalidate(1, bgColor = $$props.bgColor);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inputVal, bgColor, height, onFocus, onBlur, input_input_handler];
    }

    class DInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { inputVal: 0, bgColor: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DInput",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*inputVal*/ ctx[0] === undefined && !("inputVal" in props)) {
    			console.warn("<DInput> was created without expected prop 'inputVal'");
    		}

    		if (/*bgColor*/ ctx[1] === undefined && !("bgColor" in props)) {
    			console.warn("<DInput> was created without expected prop 'bgColor'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<DInput> was created without expected prop 'height'");
    		}
    	}

    	get inputVal() {
    		throw new Error("<DInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputVal(value) {
    		throw new Error("<DInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<DInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<DInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<DInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<DInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/components/StList.svelte generated by Svelte v3.24.1 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$1 = "src/components/StList.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[15] = list;
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (243:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let div;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$mydata*/ ctx[3].filter(/*func*/ ctx[8]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fetch Data";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			div = element("div");
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "svelte-1fu6jcs");
    			add_location(button, file$1, 244, 1, 5731);
    			add_location(br, file$1, 245, 1, 5781);
    			attr_dev(input0, "id", "name-input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Search by name");
    			attr_dev(input0, "class", "svelte-1fu6jcs");
    			add_location(input0, file$1, 248, 2, 5816);
    			attr_dev(input1, "id", "tag-input");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Search by tag");
    			attr_dev(input1, "class", "svelte-1fu6jcs");
    			add_location(input1, file$1, 249, 2, 5909);
    			attr_dev(div, "class", "list-body svelte-1fu6jcs");
    			add_location(div, file$1, 247, 1, 5790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			set_input_value(input0, /*filterByName*/ ctx[1]);
    			append_dev(div, t3);
    			append_dev(div, input1);
    			set_input_value(input1, /*filterByTag*/ ctx[2]);
    			append_dev(div, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*fetchData*/ ctx[4], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filterByName*/ 2 && input0.value !== /*filterByName*/ ctx[1]) {
    				set_input_value(input0, /*filterByName*/ ctx[1]);
    			}

    			if (dirty & /*filterByTag*/ 4 && input1.value !== /*filterByTag*/ ctx[2]) {
    				set_input_value(input1, /*filterByTag*/ ctx[2]);
    			}

    			if (dirty & /*$mydata, filterByName, filterByTag, avgGrade*/ 46) {
    				each_value = /*$mydata*/ ctx[3].filter(/*func*/ ctx[8]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(243:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (240:0) {#if $mydata.length == 0}
    function create_if_block(ctx) {
    	let button;
    	let t1;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Fetch Data";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Fetch data to see it";
    			attr_dev(button, "class", "svelte-1fu6jcs");
    			add_location(button, file$1, 240, 1, 5584);
    			add_location(p, file$1, 241, 1, 5634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*fetchData*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(240:0) {#if $mydata.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (261:4) {#if user.expandGrade}
    function create_if_block_1(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let input;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*user*/ ctx[14].grades;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*user*/ ctx[14].tags;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each1_else = null;

    	if (!each_value_1.length) {
    		each1_else = create_else_block_1(ctx);
    	}

    	function keypress_handler(...args) {
    		return /*keypress_handler*/ ctx[10](/*user*/ ctx[14], /*each_value*/ ctx[15], /*index*/ ctx[16], ...args);
    	}

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[11].call(input, /*each_value*/ ctx[15], /*index*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each1_else) {
    				each1_else.c();
    			}

    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", "tags svelte-1fu6jcs");
    			add_location(div0, file$1, 265, 6, 6986);
    			attr_dev(input, "id", "add-tag-input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Add a tag");
    			attr_dev(input, "class", "svelte-1fu6jcs");
    			add_location(input, file$1, 272, 6, 7137);
    			attr_dev(div1, "class", "user-grades svelte-1fu6jcs");
    			add_location(div1, file$1, 261, 5, 6805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			if (each1_else) {
    				each1_else.m(div0, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*user*/ ctx[14].tempTag);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keypress", keypress_handler, false, false, false),
    					listen_dev(input, "input", input_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$mydata, filterByName, filterByTag*/ 14) {
    				each_value_2 = /*user*/ ctx[14].grades;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$mydata, filterByName, filterByTag*/ 14) {
    				each_value_1 = /*user*/ ctx[14].tags;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;

    				if (each_value_1.length) {
    					if (each1_else) {
    						each1_else.d(1);
    						each1_else = null;
    					}
    				} else if (!each1_else) {
    					each1_else = create_else_block_1(ctx);
    					each1_else.c();
    					each1_else.m(div0, null);
    				}
    			}

    			if (dirty & /*$mydata, filterByName, filterByTag*/ 14 && input.value !== /*user*/ ctx[14].tempTag) {
    				set_input_value(input, /*user*/ ctx[14].tempTag);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -10, duration: 200 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { y: -10, duration: 200 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (each1_else) each1_else.d();
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(261:4) {#if user.expandGrade}",
    		ctx
    	});

    	return block;
    }

    // (263:6) {#each user.grades as grade,gind}
    function create_each_block_2(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*gind*/ ctx[22] + 1 + "";
    	let t1;
    	let t2;
    	let t3_value = /*grade*/ ctx[20] + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Test");
    			t1 = text(t1_value);
    			t2 = text(":   ");
    			t3 = text(t3_value);
    			t4 = text("%");
    			add_location(div, file$1, 263, 7, 6923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$mydata, filterByName, filterByTag*/ 14 && t3_value !== (t3_value = /*grade*/ ctx[20] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(263:6) {#each user.grades as grade,gind}",
    		ctx
    	});

    	return block;
    }

    // (269:7) {:else}
    function create_else_block_1(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(269:7) {:else}",
    		ctx
    	});

    	return block;
    }

    // (267:7) {#each user.tags as tag, tidx}
    function create_each_block_1(ctx) {
    	let div;
    	let t_value = /*tag*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tag svelte-1fu6jcs");
    			add_location(div, file$1, 267, 8, 7051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$mydata, filterByName, filterByTag*/ 14 && t_value !== (t_value = /*tag*/ ctx[17] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(267:7) {#each user.tags as tag, tidx}",
    		ctx
    	});

    	return block;
    }

    // (252:2) {#each $mydata.filter(t => ( t.firstName.concat('',t.lastName)).toLowerCase().includes(filterByName) && ( filterByTag != "" ?  t.tags.find(ele => ele.includes(filterByTag)): true ) ) as user,index}
    function create_each_block(ctx) {
    	let div7;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let t1_value = /*user*/ ctx[14].firstName + "";
    	let t1;
    	let t2;
    	let t3_value = /*user*/ ctx[14].lastName + "";
    	let t3;
    	let t4;
    	let div1;
    	let t5;
    	let t6_value = /*user*/ ctx[14].email + "";
    	let t6;
    	let t7;
    	let div2;
    	let t8;
    	let t9_value = /*user*/ ctx[14].company + "";
    	let t9;
    	let t10;
    	let div3;
    	let t11;
    	let t12_value = /*user*/ ctx[14].skill + "";
    	let t12;
    	let t13;
    	let div4;
    	let t14;
    	let t15_value = /*avgGrade*/ ctx[5](/*user*/ ctx[14].grades) + "";
    	let t15;
    	let t16;
    	let t17;
    	let div6;
    	let div5;
    	let div5_id_value;
    	let t18;
    	let t19;
    	let div7_transition;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[9](/*user*/ ctx[14], /*each_value*/ ctx[15], /*index*/ ctx[16], ...args);
    	}

    	let if_block = /*user*/ ctx[14].expandGrade && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			t5 = text("Email: ");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			t8 = text("Company: ");
    			t9 = text(t9_value);
    			t10 = space();
    			div3 = element("div");
    			t11 = text("Skill: ");
    			t12 = text(t12_value);
    			t13 = space();
    			div4 = element("div");
    			t14 = text("Average:");
    			t15 = text(t15_value);
    			t16 = text("%");
    			t17 = space();
    			div6 = element("div");
    			div5 = element("div");
    			t18 = space();
    			if (if_block) if_block.c();
    			t19 = space();
    			attr_dev(img, "class", "user-pic svelte-1fu6jcs");
    			if (img.src !== (img_src_value = /*user*/ ctx[14].pic)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "" + (/*user*/ ctx[14].firstName + "-avatar"));
    			add_location(img, file$1, 253, 4, 6253);
    			attr_dev(div0, "class", "user-name svelte-1fu6jcs");
    			add_location(div0, file$1, 254, 4, 6327);
    			attr_dev(div1, "class", "user-email svelte-1fu6jcs");
    			add_location(div1, file$1, 255, 4, 6393);
    			attr_dev(div2, "class", "user-company svelte-1fu6jcs");
    			add_location(div2, file$1, 256, 4, 6447);
    			attr_dev(div3, "class", "user-skill svelte-1fu6jcs");
    			add_location(div3, file$1, 257, 4, 6507);
    			attr_dev(div4, "class", "user-average svelte-1fu6jcs");
    			add_location(div4, file$1, 258, 4, 6561);
    			attr_dev(div5, "id", div5_id_value = /*user*/ ctx[14].expandGrade ? "square" : "cross");
    			attr_dev(div5, "class", "svelte-1fu6jcs");
    			add_location(div5, file$1, 259, 85, 6711);
    			attr_dev(div6, "class", "expand-btn svelte-1fu6jcs");
    			add_location(div6, file$1, 259, 4, 6630);
    			attr_dev(div7, "class", "user-profile-cart svelte-1fu6jcs");
    			add_location(div7, file$1, 252, 3, 6201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, img);
    			append_dev(div7, t0);
    			append_dev(div7, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div7, t4);
    			append_dev(div7, div1);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div7, t7);
    			append_dev(div7, div2);
    			append_dev(div2, t8);
    			append_dev(div2, t9);
    			append_dev(div7, t10);
    			append_dev(div7, div3);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div7, t13);
    			append_dev(div7, div4);
    			append_dev(div4, t14);
    			append_dev(div4, t15);
    			append_dev(div4, t16);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div7, t18);
    			if (if_block) if_block.m(div7, null);
    			append_dev(div7, t19);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div6, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*$mydata, filterByName, filterByTag*/ 14 && img.src !== (img_src_value = /*user*/ ctx[14].pic)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*$mydata, filterByName, filterByTag*/ 14 && img_alt_value !== (img_alt_value = "" + (/*user*/ ctx[14].firstName + "-avatar"))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t1_value !== (t1_value = /*user*/ ctx[14].firstName + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t3_value !== (t3_value = /*user*/ ctx[14].lastName + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t6_value !== (t6_value = /*user*/ ctx[14].email + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t9_value !== (t9_value = /*user*/ ctx[14].company + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t12_value !== (t12_value = /*user*/ ctx[14].skill + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*$mydata, filterByName, filterByTag*/ 14) && t15_value !== (t15_value = /*avgGrade*/ ctx[5](/*user*/ ctx[14].grades) + "")) set_data_dev(t15, t15_value);

    			if (!current || dirty & /*$mydata, filterByName, filterByTag*/ 14 && div5_id_value !== (div5_id_value = /*user*/ ctx[14].expandGrade ? "square" : "cross")) {
    				attr_dev(div5, "id", div5_id_value);
    			}

    			if (/*user*/ ctx[14].expandGrade) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$mydata, filterByName, filterByTag*/ 14) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div7, t19);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, true);
    				div7_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, false);
    			div7_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block) if_block.d();
    			if (detaching && div7_transition) div7_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(252:2) {#each $mydata.filter(t => ( t.firstName.concat('',t.lastName)).toLowerCase().includes(filterByName) && ( filterByTag != \\\"\\\" ?  t.tags.find(ele => ele.includes(filterByTag)): true ) ) as user,index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$mydata*/ ctx[3].length == 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLocalData() {
    	if (localStorage.getItem("myData")) return JSON.parse(localStorage.getItem("myData"));
    	return [];
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $mydata,
    		$$unsubscribe_mydata = noop,
    		$$subscribe_mydata = () => ($$unsubscribe_mydata(), $$unsubscribe_mydata = subscribe(mydata, $$value => $$invalidate(3, $mydata = $$value)), mydata);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_mydata());

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	const mydata = writable(getLocalData());
    	validate_store(mydata, "mydata");
    	$$subscribe_mydata();
    	let filterByName = "";
    	let filterByTag = "";

    	function fetchData() {
    		return __awaiter(this, void 0, void 0, function* () {
    			const getData = yield fetch("https://www.hatchways.io/api/assessment/students").then(res => res.json()).then(data => {
    				set_store_value(mydata, $mydata = data.students.map(student => {
    					return Object.assign(Object.assign({}, student), {
    						expandGrade: false, //response type
    						tempTag: "",
    						tags: []
    					});
    				}));

    				console.log($mydata);
    				console.log(typeof $mydata);
    			});
    		});
    	}

    	$mydata.length === 0 && fetchData();
    	const avgGrade = arr => arr.reduce((p, c) => parseFloat(p) + parseFloat(c), 0) / arr.length;

    	function handleSave() {
    		localStorage.setItem("myData", JSON.stringify($mydata));
    		console.log($mydata);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<StList> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("StList", $$slots, []);

    	function input0_input_handler() {
    		filterByName = this.value;
    		$$invalidate(1, filterByName);
    	}

    	function input1_input_handler() {
    		filterByTag = this.value;
    		$$invalidate(2, filterByTag);
    	}

    	const func = t => t.firstName.concat("", t.lastName).toLowerCase().includes(filterByName) && (filterByTag != ""
    	? t.tags.find(ele => ele.includes(filterByTag))
    	: true);

    	const click_handler = (user, each_value, index) => set_store_value(mydata, each_value[index].expandGrade = !user.expandGrade, $mydata, $$invalidate(1, filterByName), $$invalidate(2, filterByTag));

    	const keypress_handler = (user, each_value, index, event) => {
    		event.keyCode === 13 && user.tempTag !== ""
    		? (set_store_value(mydata, each_value[index].tags = [...user.tags, user.tempTag], $mydata, $$invalidate(1, filterByName), $$invalidate(2, filterByTag)), set_store_value(mydata, each_value[index].tempTag = "", $mydata, $$invalidate(1, filterByName), $$invalidate(2, filterByTag)))
    		: null;
    	};

    	function input_input_handler(each_value, index) {
    		each_value[index].tempTag = this.value;
    		$$invalidate(1, filterByName);
    		$$invalidate(2, filterByTag);
    	}

    	$$self.$capture_state = () => ({
    		__awaiter,
    		DInput,
    		writable,
    		fade,
    		fly,
    		each,
    		mydata,
    		filterByName,
    		filterByTag,
    		fetchData,
    		avgGrade,
    		handleSave,
    		getLocalData,
    		$mydata
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("filterByName" in $$props) $$invalidate(1, filterByName = $$props.filterByName);
    		if ("filterByTag" in $$props) $$invalidate(2, filterByTag = $$props.filterByTag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$mydata*/ 8) {
    			 $mydata && handleSave();
    		}
    	};

    	return [
    		mydata,
    		filterByName,
    		filterByTag,
    		$mydata,
    		fetchData,
    		avgGrade,
    		input0_input_handler,
    		input1_input_handler,
    		func,
    		click_handler,
    		keypress_handler,
    		input_input_handler
    	];
    }

    class StList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { mydata: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StList",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get mydata() {
    		return this.$$.ctx[0];
    	}

    	set mydata(value) {
    		throw new Error("<StList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.1 */
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let t;
    	let main;
    	let stlist;
    	let current;
    	stlist = new StList({ $$inline: true });

    	const block = {
    		c: function create() {
    			t = space();
    			main = element("main");
    			create_component(stlist.$$.fragment);
    			document.title = "Student List";
    			attr_dev(main, "class", "svelte-dplidf");
    			add_location(main, file$2, 19, 0, 501);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(stlist, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			destroy_component(stlist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const name = writable("");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ writable, StList, name });
    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get name() {
    		return this.$$.ctx[0];
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("serviceWorkerStudentDemo.js")
                .then(res => console.log("service worker registered"))
                .catch(err => console.log("service worker not registered", err));
        });
    }
    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

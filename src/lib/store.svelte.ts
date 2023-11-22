type Student = {
	city: typeof $state<string>;
	company: typeof $state<string>;
	email: typeof $state<string>;
	firstName: typeof $state<string>;
	grades: typeof $state<[string]>;
	id: typeof $state<string>;
	lastName: typeof $state<string>;
	pic: typeof $state<string>;
	skill: typeof $state<string>;
};

export function createLocalData() {
	const localStorage = null;
	let store = $state(getLocalData());
	let filterByName: string = $state('');
	let filterByTag: string = $state('');
	let filtered = $derived(
		store.filter(
			(t: { firstName: string; lastName: any; tags: any[] }) =>
				t.firstName.concat(' ', t.lastName).toLowerCase().includes(filterByName.toLowerCase()) &&
				(filterByTag != ''
					? t.tags.find((ele) => ele.toLowerCase().includes(filterByTag.toLowerCase()))
					: true)
		)
	);
	async function fetchData() {
		await fetch('https://api.hatchways.io/assessment/students')
			.then((res) => res.json()) //response type
			.then((data) => {
				store = data.students.map((student: Student) => {
					return {
						...student,
						expandGrade: typeof $state<boolean>,
						tempTag: typeof $state<string>,
						tags: typeof $state<[string]>
					};
				});
				console.log(data);
				console.log(typeof data);
			});
	}

	store.length === 0 && fetchData();
	const expandGrade = (index: number) => {
		store[index].expandGrade = !store[index].expandGrade;
	};
	const addTag = (index: number, newTag: string) => {
		store[index].tags.push(newTag);
		store[index].tags = store[index].tags;
		store[index].tempTag = '';
	};
	const avgGrade = (arr: any[]) =>
		arr.reduce((p, c) => parseFloat(p) + parseFloat(c), 0) / arr.length;

	function handleSave() {
		localStorage?.setItem('data', JSON.stringify(store));
		console.log(store);
	}
	function getLocalData() {
		if (!localStorage?.getItem('store')) return [];
		return JSON.parse(localStorage?.getItem('store'));
	}

	$effect(() => {
		handleSave();
	});

	return {
		get data() {
			return store;
		},
		get filtered() {
			return filtered;
		},
		set filterByName(_) {
			filterByName = _;
		},
		get filterByName() {
			return filterByName;
		},
		set filterByTag(_) {
			filterByTag = _;
		},
		get filterByTag() {
			return filterByTag;
		},
		avgGrade,
		fetchData,
		expandGrade,
		addTag
	};
}

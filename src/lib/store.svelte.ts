import { onMount } from 'svelte'
type Student = {
	city: string
	company: string
	email: string
	firstName: string
	grades: []
	id: string
	lastName: string
	pic: string
	skill: string
}

function createStudent() {
	let city = $state('')
	let company = $state('')
	let email = $state('')
	let firstName = $state('')
	let grades: [] = $state([])
	let id = $state('')
	let lastName = $state('')
	let pic = $state('')
	let skill = $state('')
	let expandGrade = $state(false)
	let tempTag = $state('')
	let tags: string[] = $state([])

	const expandedGrade = () => {
		expandGrade = !expandGrade
	}
	const addTag = () => {
		if (tempTag !== '') {
			tags.push(tempTag)
			tags = tags
			tempTag = ''
		}
	}
	const avgGrade = () => grades.reduce((p, c) => parseFloat(p) + parseFloat(c), 0) / grades.length
	let avg = $derived(avgGrade())
	const setAll = (student: Student) => {
		city = student.city
		company = student.company
		email = student.email
		firstName = student.firstName
		grades = student.grades
		id = student.id
		lastName = student.lastName
		pic = student.pic
		skill = student.skill
	}
	return {
		get city(): string {
			return city
		},
		set city(_) {
			city = _
		},
		get company(): string {
			return company
		},
		set company(_) {
			company = _
		},
		get email(): string {
			return email
		},
		set email(_) {
			email = _
		},
		get firstName(): string {
			return firstName
		},
		set firstName(_) {
			firstName = _
		},
		get lastName(): string {
			return lastName
		},
		set lastName(_) {
			lastName = _
		},
		get grades(): [] {
			return grades
		},
		get avg() {
			return avg
		},
		set grades(_) {
			grades = _
		},
		get id(): string {
			return id
		},
		set id(_) {
			id = _
		},
		get pic(): string {
			return pic
		},
		set pic(_) {
			pic = _
		},
		get skill(): string {
			return skill
		},
		set skill(_) {
			skill = _
		},
		get expandGrade(): boolean {
			return expandGrade
		},
		get tempTag(): string {
			return tempTag
		},
		get tags(): string[] {
			return tags
		},
		set tempTag(_) {
			tempTag = _
		},
		setAll,
		addTag,
		expandedGrade
	}
}

export function createLocalData() {
	const localStorage = null
	let store = $state(getLocalData())
	let filterByName: string = $state('')
	let filterByTag: string = $state('')
	let filtered = $derived(
		store.filter(
			(t: { firstName: string; lastName: any; tags: any[] }) =>
				t.firstName.concat(' ', t.lastName).toLowerCase().includes(filterByName.toLowerCase()) &&
				(filterByTag != ''
					? t.tags.find((ele) => ele.toLowerCase().includes(filterByTag.toLowerCase()))
					: true)
		)
	)
	function fetchData() {
		onMount(async () => {
			await fetch('https://api.hatchways.io/assessment/students')
				.then((res) => res.json()) //response type
				.then((data) => {
					store = data.students.map((student: Student) => {
						const newStudent = createStudent()
						newStudent.setAll(student)
						return newStudent
					})
					// console.log('fetch', store)
				})
		})
	}

	store.length === 0 && fetchData()

	function handleSave() {
		localStorage?.setItem('data', JSON.stringify(store))
		console.log('saved')
	}
	function getLocalData() {
		if (!localStorage?.getItem('store')) return []
		return JSON.parse(localStorage?.getItem('store'))
	}

	$effect(() => {
		handleSave()
	})

	return {
		get data() {
			return store
		},
		get filtered() {
			return filtered
		},
		set filterByName(_) {
			filterByName = _
		},
		get filterByName() {
			return filterByName
		},
		set filterByTag(_) {
			filterByTag = _
		},
		get filterByTag() {
			return filterByTag
		},
		fetchData
	}
}

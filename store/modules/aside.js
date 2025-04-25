import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'
export const useAsideStore = defineStore('aside', () => {
	const asideChange = ref(false)

	return {
		asideChange
	}
})
import { browser } from '$app/environment';

const LOCAL_STORAGE_KEY = 'tqp_default_tab';

export type Tab = 'all' | 'ranked' | 'filter' | 'favorites';

export function getDefaultTab(): Tab {
	if (!browser) {
		return 'all';
	}

	const tab = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (!tab) {
		return 'all';
	}

	return tab as Tab;
}

export function setDefaultTab(tab: Tab) {
	localStorage.setItem(LOCAL_STORAGE_KEY, tab);
}

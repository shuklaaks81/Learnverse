/**
 * Custom Page ID Manager
 * Manages unique page IDs for user-created features
 * Pool of 50 unique IDs that can be claimed and released
 */

// 50 unique page IDs - random-looking but memorable strings
export const AVAILABLE_PAGE_IDS = [
  'fnt86myi6',
  'xk9pq2rl7',
  'bvm45whs3',
  'zqj73nct8',
  'hyr62kdf4',
  'plt98vgx1',
  'wmn54bjz9',
  'dks27qfp6',
  'gtr91xvm2',
  'jnb36lhc5',
  'ycf84rpw7',
  'qvx29tkn3',
  'mzh67sgj8',
  'lfw52dqb4',
  'rbp71kxm9',
  'npr83vhz6',
  'sxj46wtc1',
  'khm95lgf2',
  'tvq38rbn7',
  'czw64pjy5',
  'fgn27xkd8',
  'pxr91mhv3',
  'wkj53qsl6',
  'bhz72nfp9',
  'dqm48tgc4',
  'ylt86vjw2',
  'gxp35kzr7',
  'jvn69shq1',
  'rnf42wbc5',
  'mkh97xtp8',
  'lst24dfj6',
  'vzq78gbm3',
  'pjw56cnh9',
  'xrf31ktl4',
  'bnc82pvy7',
  'hqs65mzg2',
  'tpx49jfw8',
  'kgm73rbv5',
  'wdl91hnz1',
  'fjt28qxc6',
  'nzb54vpk3',
  'qhx87wgs9',
  'ryj36mlf4',
  'svm69dtc7',
  'cpz41knb2',
  'lbw75hjx8',
  'xhr23qgp5',
  'mtk96vzf1',
  'gnp58rjw4',
  'vfq32xlh6'
];

export interface CustomPage {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string; // kidId
  design: any; // The visual design data
  component: string; // Generated component code
}

/**
 * Get all used page IDs from localStorage
 */
export function getUsedPageIds(): string[] {
  if (typeof window === 'undefined') return [];
  
  const usedIds = localStorage.getItem('customPageUsedIds');
  return usedIds ? JSON.parse(usedIds) : [];
}

/**
 * Get all available (unused) page IDs
 */
export function getAvailablePageIds(): string[] {
  const usedIds = getUsedPageIds();
  return AVAILABLE_PAGE_IDS.filter(id => !usedIds.includes(id));
}

/**
 * Claim a page ID for a new custom page
 * Returns the ID if successful, or null if no IDs available
 */
export function claimPageId(): string | null {
  const availableIds = getAvailablePageIds();
  
  if (availableIds.length === 0) {
    return null; // All pages in use!
  }
  
  // Get a random available ID
  const newId = availableIds[Math.floor(Math.random() * availableIds.length)];
  
  // Mark it as used
  const usedIds = getUsedPageIds();
  usedIds.push(newId);
  localStorage.setItem('customPageUsedIds', JSON.stringify(usedIds));
  
  return newId;
}

/**
 * Release a page ID back to the pool
 */
export function releasePageId(id: string): void {
  if (typeof window === 'undefined') return;
  
  const usedIds = getUsedPageIds();
  const newUsedIds = usedIds.filter(usedId => usedId !== id);
  localStorage.setItem('customPageUsedIds', JSON.stringify(newUsedIds));
  
  // Also delete the page data
  localStorage.removeItem(`customPage_${id}`);
}

/**
 * Save a custom page
 */
export function saveCustomPage(id: string, page: CustomPage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`customPage_${id}`, JSON.stringify(page));
}

/**
 * Load a custom page by ID
 */
export function loadCustomPage(id: string): CustomPage | null {
  if (typeof window === 'undefined') return null;
  
  const pageData = localStorage.getItem(`customPage_${id}`);
  return pageData ? JSON.parse(pageData) : null;
}

/**
 * Get all custom pages created by a specific kid
 */
export function getKidCustomPages(kidId: string): CustomPage[] {
  if (typeof window === 'undefined') return [];
  
  const usedIds = getUsedPageIds();
  const pages: CustomPage[] = [];
  
  usedIds.forEach(id => {
    const page = loadCustomPage(id);
    if (page && page.createdBy === kidId) {
      pages.push(page);
    }
  });
  
  return pages;
}

/**
 * Get stats about page ID usage
 */
export function getPageStats() {
  const used = getUsedPageIds().length;
  const available = AVAILABLE_PAGE_IDS.length - used;
  const total = AVAILABLE_PAGE_IDS.length;
  
  return {
    used,
    available,
    total,
    percentUsed: Math.round((used / total) * 100)
  };
}

/**
 * Check if all pages are in use (for the funny error message)
 */
export function areAllPagesInUse(): boolean {
  return getAvailablePageIds().length === 0;
}

export const STORAGE_KEY = 'vibeboxes_save_v2';

export function saveState(state){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.warn('save failed', e); }
}

export function loadState(defaultState){
  try{
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vibeboxes_save_v1');
    if(raw){ const parsed = JSON.parse(raw); return Object.assign(defaultState, parsed); }
  }catch(e){ console.warn('load failed', e); }
  return defaultState;
}

export function nextLevelPoints(state){
  return 100*state.level;
}

export function checkLevelUp(state, pushLog, renderAll){
  const needed = nextLevelPoints(state);
  if(state.points >= needed){
    state.level+=1;
    pushLog(`Leveled up! Now level ${state.level}`);
    state.freeBoxes+=1;
    renderAll();
    checkLevelUp(state, pushLog, renderAll);
  }
}

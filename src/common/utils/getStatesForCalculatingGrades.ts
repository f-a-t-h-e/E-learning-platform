export const getStatesForCalculatingGrades = (
  state?: 'available' | 'calculatedGrades',
) => {
  const targetStates = [] as ('available' | 'calculatedGrades')[];
  if (state == 'available') {
    targetStates.push('available');
  } else {
    targetStates.push('calculatedGrades');
    targetStates.push('available');
  }

  return targetStates;
};

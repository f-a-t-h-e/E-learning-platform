export const getStatesForCalculatingGrades = (
  state?: 'available' | 'calculated_grades',
) => {
  const targetStates = [] as ('available' | 'calculated_grades')[];
  if (state == 'available') {
    targetStates.push('available');
  } else {
    targetStates.push('calculated_grades');
    targetStates.push('available');
  }

  return targetStates;
};

import { ref } from '@vue/composition-api';

export default () => {
  const visibility = ref('all');
  const filterAll = () => {
    visibility.value = 'all';
  };
  const filterActive = () => {
    visibility.value = 'active';
  };
  const filterCompleted = () => {
    visibility.value = 'completed';
  };

  return {
    visibility,
    filterAll,
    filterActive,
    filterCompleted,
  };
};

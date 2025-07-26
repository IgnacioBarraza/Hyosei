import { Category } from '../core/models/category';
import { Project } from '../core/models/projects';

export function enrichCategoriesWithCountAndColor(
  categories: Category[],
  projects: Project[]
): Category[] {
  const countMap: Record<string, number> = {};

  for (const project of projects) {
    const catId = project.category?.id;
    if (catId) {
      countMap[catId] = (countMap[catId] || 0) + 1;
    }
  }

  const colorByCategoryName: Record<string, string> = {
    kinesiología: 'bg-purple-500',
    kinesiologia: 'bg-purple-500',
    'introducción a física': 'bg-orange-500',
    'introduccion a física': 'bg-orange-500',
    'introduccion a la fisica': 'bg-orange-500',
    'mecánica clásica': 'bg-blue-500',
    'mecanica clásica': 'bg-blue-500',
    mecanica: 'bg-blue-500',
    electromagnetismo: 'bg-red-500',
  };

  return categories.map((cat) => {
    const normalizedName = cat.name.trim().toLowerCase();
    return {
      ...cat,
      projects: countMap[cat.id] || 0,
      color: colorByCategoryName[normalizedName] || 'bg-gray-400',
    };
  });
}

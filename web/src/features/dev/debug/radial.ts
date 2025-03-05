import { debugData } from '../../../utils/debugData';
import type { RadialMenuItem } from '../../../typings';

export const debugRadial = () => {
  debugData<{ items: RadialMenuItem[]; sub?: boolean }>([
    {
      action: 'openRadialMenu',
      data: {
        items: [
          { icon: 'palette', label: 'Paint' },
          { icon: 'warehouse', label: 'Garage' },
          { icon: 'palette', label: 'Long Label Test' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen' },
          { icon: 'palette', label: 'Fahrzeuginteraktionen 2' }, // Differentiated
          { icon: 'https://i.imgur.com/6tPtRHU.gif', label: 'External Icon', iconWidth: 35, iconHeight: 35 },
          { icon: 'palette', label: 'Paint (Duplicate)' },
          { icon: 'ellipsis-h', label: 'More', isMore: true }, // Pagination test
        ],
      },
    },
  ]);
};

import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface RadialMenuItem {
  icon: IconProp | `http${string}`; // Restricts `string` to URLs only
  label: string;
  isMore?: boolean;
  menu?: string;
  iconWidth?: number;
  iconHeight?: number;
}

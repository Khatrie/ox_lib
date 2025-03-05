import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    justifyItems: 'center',
    alignItems: 'center',
    width: '310px',
    height: '310px',
  },
  gridItem: {
    width: '80px',
    height: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.dark[6],
    borderRadius: '10px',
    transition: 'background 0.3s ease',
    border: '1px solid #0099ad',
    WebkitMaskImage: 'url("https://webstore-template-assets.tebex.io/images/button-mask-se.svg")',
    WebkitMaskSize: '80px',
    WebkitMaskRepeat: 'no-repeat',
    '&:hover': {
      backgroundColor: '#0099ad',
      '> span': {
        color: 'white',
      },
    },


    '> span': {
      marginTop: '6px',
      color: '#fff',
      fontSize: '12px',
      textAlign: 'center',
      wordWrap: 'break-word',
      overflow: 'hidden',
      whiteSpace: 'normal',
      maxWidth: '90%',
    },
    '> img, > svg': {
      filter: 'brightness(1.5) contrast(1.5)',
    },
  },
  centerItem: {
    width: '80px',
    height: '80px',
    background: 'radial-gradient(circle, rgba(133, 58, 59) 12%, rgba(105,46,47, 0.2) 100%)',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    cursor: 'pointer',
    border: '1px solid #0099ad',
    WebkitMaskImage: 'url("https://webstore-template-assets.tebex.io/images/button-mask-se.svg")',
    WebkitMaskSize: '80px',
    WebkitMaskRepeat: 'no-repeat',
    '&:hover': {
      backgroundColor: '#0099ad',
    },
  },
  
}));

const PAGE_ITEMS = 9;

const isExternalIcon = (icon: string | IconProp): icon is string => 
  typeof icon === 'string' && icon.startsWith('http');

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(PAGE_ITEMS * (menu.page - 1), PAGE_ITEMS * menu.page);
    if (PAGE_ITEMS * menu.page < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    setMenu({ ...data, page: 1 });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
      {visible && <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />}
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <div className={classes.gridContainer}>
            {menuItems.map((item, index) => (
              <div key={index} className={classes.gridItem} onClick={async () => {
                if (!item.isMore) fetchNui('radialClick', index);
                else await changePage(true);
              }}>
                {isExternalIcon(item.icon) ? (
                  <img src={item.icon} width={30} height={30} alt={item.label} />
                ) : (
                  <LibIcon icon={item.icon as IconProp} fixedWidth />
                )}
                <span>{item.label || 'Unknown'}</span>
              </div>
            ))}
            <div className={classes.centerItem} onClick={async () => {
              if (menu.page > 1) await changePage();
              else if (menu.sub) fetchNui('radialBack');
              else {
                setVisible(false);
                fetchNui('radialClose');
              }
            }}>
              <LibIcon icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'} fixedWidth color="#fff" size="2x" />
            </div>
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;

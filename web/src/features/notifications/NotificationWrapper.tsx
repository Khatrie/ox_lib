import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

// Define styles for the notification container
const useStyles = createStyles((theme) => ({
  container: {
    width: 300,
    height: 'fit-content',
    color: theme.colors.dark[0],
    padding: 12,
    border: `1px solid ${theme.colors.grey[5]}`,
    borderRadius: theme.radius.sm,
    fontFamily: 'Montserrat',
  },
  title: {
    fontWeight: 700,
    lineHeight: 'normal',
  },
  description: {
    fontSize: 12,
    color: theme.colors.white[5],
    fontFamily: 'Montserrat',
    lineHeight: 'normal',
  },
  descriptionOnly: {
    fontSize: 14,
    color: theme.colors.white[5],
    fontFamily: 'Montserrat',
    lineHeight: 'normal',
  },
}));

// Define animations for showing/hiding notifications
const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom') ? { from: 'Y(30px)', to: 'Y(0px)' } : { from: 'Y(-30px)', to: 'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

// Animation for the duration circle
const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

// Define typeStyles with an index signature to allow dynamic keys
interface TypeStyles {
  [key: string]: {
    background: string;
    boxShadow: string;
  };
}

const typeStyles: TypeStyles = {
  error: {
    background: 'radial-gradient(31.98% 56.85% at 50% 50%, rgba(12, 13, 18, 0.96) 0%, rgba(14, 15, 19, 0.96) 100%)',
    boxShadow: 'inset 0px 0px 72px rgba(185, 65, 65, 0.25)',
  },
  success: {
    background: 'radial-gradient(31.98% 56.85% at 50% 50%, rgba(12, 13, 18, 0.96) 0%, rgba(14, 15, 19, 0.96) 100%)',
    boxShadow: 'inset 0px 0px 72px rgba(0, 248, 185, 0.25)',
  },
  warning: {
    background: 'radial-gradient(31.98% 56.85% at 50% 50%, rgba(12, 13, 18, 0.96) 0%, rgba(14, 15, 19, 0.96) 100%)',
    boxShadow: 'inset 0px 0px 72px rgba(185, 159, 65, 0.25)',
  },
  info: {
    background: '#283047f0',
    boxShadow: 'inset 0px 0px 72px #283047f0',
  },
  inform: {
    background: '#283047f0',
    boxShadow: 'inset 0px 0px 72px #283047f0',
  },
  default: {
    background: '#283047f0',
    boxShadow: 'inset 0px 0px 72px #283047f0',
  },
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let iconColor: string;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey((prevKey) => prevKey + 1);

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        case 'inform':
          data.icon = 'circle-info';
          break;
          case 'info':
            data.icon = 'circle-info';
            break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      iconColor = '#0099ad';
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    const type = data.type || 'default';

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            background: typeStyles[type].background,
            boxShadow: typeStyles[type].boxShadow,
            ...data.style,
          }}
          className={classes.container}
        >
          <Group noWrap spacing={12}>
            {data.icon && (
              <>
                {data.showDuration ? (
                  <RingProgress
                    key={toastKey}
                    size={38}
                    thickness={2}
                    sections={[{ value: 100, color: iconColor }]}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                    styles={{
                      root: {
                        '> svg > circle:nth-of-type(2)': {
                          animation: `${durationCircle} linear forwards reverse`,
                          animationDuration: `${duration}ms`,
                        },
                        margin: -3,
                      },
                    }}
                    label={
                      <Center>
                        <ThemeIcon
                          color={iconColor}
                          radius="xl"
                          size={32}
                          variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                        >
                          <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon
                    color={iconColor}
                    radius="xl"
                    size={32}
                    variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                  >
                    <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                  </ThemeIcon>
                )}
              </>
            )}
            <Stack spacing={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;

import React, { useEffect, useRef } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 400,
    height: 17,
    transform: 'skewX(-30deg)', // Removed translateY(-50%) to adjust for bottom positioning
    background: `repeating-linear-gradient(
      135deg,
      rgb(45, 55, 72),
      rgb(45, 55, 72) 4.4px,
      transparent 12px,
      transparent 4px
    )`,
    boxShadow: theme.shadows.sm,
  },
  wrapper: {
    position: 'fixed',
    bottom: 50,
    left: '50%',
    transform: 'translateX(-50%)', // Centers the progress bar horizontally
    width: 'auto',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, rgb(45, 55, 72) 2.57%, #56fdfd 102.99%)',
    boxShadow: '0 0 10px #0099adda',
    position: 'relative',
  },
  labelWrapper: {
    position: 'absolute',
    bottom: '80%', // Positions the label above the progress bar
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-between', // Distribute space between label and value
    width: '100%', // Ensure the labelWrapper takes full width
    padding: '0 10px',
  },
  label: {
    fontSize: 21,
    color: 'white',
    fontFamily: 'Bebas Neue',
    textShadow: theme.shadows.sm,
    textAlign: 'left', // Align label text to the left
  },
  value: {
    fontSize: 18,
    color: 'cyan',
    margin: 8,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    textAlign: 'right', // Align remaining time to the right
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setTimeLeft(data.duration / 1000); // Convert duration to seconds
    if (intervalRef.current) clearInterval(intervalRef.current);

    let remainingTime = data.duration / 1000; // Initialize remaining time in seconds

    intervalRef.current = setInterval(() => {
      remainingTime -= 0.1; // Decrease time by 100ms
      setTimeLeft(Math.max(remainingTime, 0)); // Ensure time doesn't go below 0
      setLabel(`${data.label}`); // Update label with original text

      if (remainingTime <= 0) {
        clearInterval(intervalRef.current!);
        setVisible(false);
        fetchNui('progressComplete');
      }
    }, 100); // Update every 100ms
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.labelWrapper}>
            <Text className={classes.label}>{label}</Text>
            <Text className={classes.value}>{Math.floor(timeLeft)}s</Text> {/* Display remaining time in seconds */}
          </Box>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            ></Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;

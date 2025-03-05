import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  modalContent: {
    backgroundColor: theme.colors.black2[5],
    border: `1px solid ${theme.colors.grey[5]}`,
  },
  modalHeader: {
    color: theme.colors.white[5],
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
  },
  contentStack: {
    color: theme.colors.white[5],
  },
  button_confirm: {
    background: '#0099ad',
    color: theme.colors.white[5],
    transition: 'background-color 0.3s ease, color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.colors.green[5],
      color: theme.colors.black[5],
    },
  },
  button_cancel: {
    boxShadow: 'inset 0px 0px 40px #B32C2CFF',
    color: theme.colors.white[5],
    transition: 'background-color 0.3s ease, color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.colors.red[5],
      color: theme.colors.white[5],
    },
  },
  gradientLine: {
    height: '4px',
    width: '100%',
    background: '#0099ad',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        classNames={{
          modal: classes.modalContent,
          header: classes.modalHeader,
        }}
        title={
        <>
          <ReactMarkdown components={MarkdownComponents}>
            {dialogData.header}
          </ReactMarkdown>
          <div className={classes.gradientLine} />
          </>
        }
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="left" spacing={10}>
            <Button
              variant={dialogData.cancel ? 'light' : 'default'}
              className={classes.button_confirm}
              color={dialogData.cancel ? theme.primaryColor : undefined}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
            {dialogData.cancel && (
            <Button
            variant="default"
            className={classes.button_cancel}
            onClick={() => closeAlert('cancel')} mr={3}>
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
            )}
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;

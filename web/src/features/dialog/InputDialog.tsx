import { Button, Group, Modal, Stack, createStyles, useMantineTheme } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
  label: {
    color: theme.colors.pink[5],
    fontWeight: 500,
  },
  description: {
    color: theme.colors.pink[5],
    /* fontSize: theme.fontSizes.sm, */
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
    height: '3px',
    width: '60%',
    background: '#0099ad',
    margin: `${theme.spacing.xs} auto`,
    marginBottom: theme.spacing.md,
  },
}));

const InputDialog: React.FC = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        } || { value: null }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size="xs"
        styles={{
          title: {
            textAlign: 'center',
            width: '100%',
            fontSize: 20,
            fontWeight: 700,
            color: theme.colors.white[5],
          },
          modal: {
            border: `1px solid ${theme.colors.grey[5]}`,
            backgroundColor: theme.colors.black2[5],
            color: theme.colors.white[5],
          },
        }}
        title={fields.heading}
        withCloseButton={false}
        overlayOpacity={0.5}
        transition="fade"
        exitTransitionDuration={150}
      >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={classes.gradientLine} />
      </div>
        <form onSubmit={onSubmit}>
          <Stack>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="left" spacing={10}>
              <Button
              variant="light"
              className={classes.button_confirm}
              type="submit">
                {locale.ui.confirm}
              </Button>
              <Button
                variant="default"
                className={classes.button_cancel}
                onClick={() => handleClose()}
                mr={3}
                disabled={fields.options?.allowCancel === false}
              >
                {locale.ui.cancel}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;

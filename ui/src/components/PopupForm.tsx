import { useImperativeHandle, useRef } from 'react';
import { useModal } from './Modal';
import { useForm } from '@tanstack/react-form';
import type { FormOptions } from '@tanstack/react-form';

type EasyFormOptions<T> = FormOptions<T, any, any, any, any, any, any, any, any, any, any, any>;

type PopupFormAction<T, F> = {
  open(title: string, formData: T | undefined, formState: F): void;
  close(): void;
};

type PopupFormProps<T, F> = {
  onSubmit?: EasyFormOptions<T>['onSubmit'];
  children?: React.ReactNode | ((formData: T | undefined, stateData: F | undefined) => React.ReactNode);
};

export type DefaultFormState = { action: 'add' | 'edit' };
export type FormSubmit<T> = EasyFormOptions<T>['onSubmit'];

export function usePopupForm<TFormData, TStateData>() {
  const formRef = useRef<PopupFormAction<TFormData, TStateData>>(null);
  const submitRef = useRef<EasyFormOptions<TFormData>['onSubmit']>(null);
  const form = useForm({
    defaultValues: undefined as TFormData,
    onSubmit(s) {
      if (submitRef.current) {
        submitRef.current(s);
      }
    },
  });
  const PopupForm = function (props: PopupFormProps<TFormData, TStateData>) {
    const formContextRef = useRef<{ original: TFormData | undefined; formState: any }>(undefined);
    const { Modal, modalRef } = useModal();
    if (props.onSubmit) {
      submitRef.current = props.onSubmit;
    }

    useImperativeHandle(formRef, () => ({
      open: (title: string, formData: TFormData | undefined, formState: TStateData) => {
        formContextRef.current = {
          original: formData,
          formState,
        };
        form.reset(formData);
        modalRef.current?.open(title);
      },
      close: () => {
        modalRef.current?.close();
      },
    }));

    return (
      <Modal
        actions={
          <>
            <button type="button" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors" onClick={() => modalRef.current?.close()}>
              取消
            </button>
            <button type="button" className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors" onClick={() => form.handleSubmit({ ...formContextRef.current })}>
              确认
            </button>
          </>
        }
      >
        {typeof props.children === 'function' ? props.children(formContextRef.current?.original, formContextRef.current?.formState) : props.children}
      </Modal>
    );
  };
  return { PopupForm, Field: form.Field, formRef };
}

import { Switch } from '@headlessui/react';
import { FieldProps } from 'formik';

export default function ToggleForm({
    field: { name, value },
    form: { setFieldValue },
    meta,
}: FieldProps<boolean>) {
    return (
        <Switch
            checked={value}
            onChange={() => {
                setFieldValue(name, !value);
            }}
            className={`${value ? 'bg-blue-300' : 'bg-gray-600'}
relative inline-flex h-[20px]  w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
        >
            <span className="sr-only">Use setting</span>
            <span className="w-full">
                <span
                    aria-hidden="true"
                    className={`${
                        value
                            ? 'translate-x-1/2 bg-blue-600'
                            : '-translate-x-1/2 bg-gray-50'
                    }
pointer-events-none inline-block h-[26px] w-[26px] origin-center translate-y-[3px] transform rounded-full shadow-lg ring-0 transition-all duration-500 ease-in-out`}
                />
            </span>
        </Switch>
    );
}

export function Toggle({
    value,
    setValue,
}: {
    value: boolean;
    setValue: (value: boolean) => void;
}) {
    return (
        <Switch
            checked={value}
            onChange={() => {
                setValue(!value);
            }}
            className={`${value ? 'bg-blue-300' : 'bg-gray-600'}
relative inline-flex h-[20px]  w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
        >
            <span className="sr-only">Use setting</span>
            <span className="w-full">
                <span
                    aria-hidden="true"
                    className={`${
                        value
                            ? 'translate-x-1/2 bg-blue-600'
                            : '-translate-x-1/2 bg-gray-50'
                    }
pointer-events-none inline-block h-[26px] w-[26px] origin-center translate-y-[3px] transform rounded-full shadow-lg ring-0 transition-all duration-500 ease-in-out`}
                />
            </span>
        </Switch>
    );
}

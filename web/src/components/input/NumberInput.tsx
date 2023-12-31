import { ErrorMessage, FieldProps } from 'formik';
import { useCallback, useEffect, useState } from 'react';

interface NumberInputProps {
    min?: number;
    max?: number;
}

/**
 * Custom Formik input field for working with numbers. Allows specifying the
 * minimum and maximum number in the field, and ensures that the value is
 * between them (inclusive) on every change. Provides step buttons for inline
 * mouse control of the field value.
 *
 * The provided inline validation should not be relied upon for form level
 * validation. If the value needs to be validated, it should still be validated
 * like any other form element
 */
export default function NumberInput({
    min,
    max,
    field: { name, value },
    form: { setFieldValue },
}: NumberInputProps & FieldProps<number>) {
    const setValue = useCallback(
        (v: number) => {
            if (Number.isNaN(v)) return;
            if (min !== undefined && v < min) return;
            if (max !== undefined && v > max) return;
            setFieldValue(name, v);
        },
        [min, max, name, setFieldValue],
    );
    const decrement = useCallback(() => {
        setValue(value - 1);
    }, [value, setValue]);
    const increment = useCallback(() => {
        setValue(value + 1);
    }, [value, setValue]);

    return (
        <>
            <div className="flex w-full bg-white text-black">
                <button
                    type="button"
                    onClick={decrement}
                    disabled={min !== undefined ? value <= min : false}
                    className="grow bg-gray-200 hover:bg-gray-400 hover:bg-opacity-50 disabled:bg-gray-400"
                >
                    -
                </button>
                <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name={name}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="rounded-none text-center"
                />
                <button
                    type="button"
                    onClick={increment}
                    disabled={max !== undefined ? value >= max : false}
                    className="grow bg-gray-200 hover:bg-gray-400 hover:bg-opacity-50 disabled:bg-gray-400"
                >
                    +
                </button>
            </div>
            <ErrorMessage name={name} />
        </>
    );
}

import { useCallback, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import * as _ from "underscore";

export type AutoSaveProps = { debounceMs: number };

const AutoSave = ({ debounceMs }: AutoSaveProps) => {
  const changed = useRef(false);
  const formik = useFormikContext<{ searchText: string }>();
  const debouncedSubmit = useCallback(
    _.debounce(() => formik.submitForm(), debounceMs),
    [debounceMs, formik.submitForm]
  );

  useEffect(() => {
    if (formik.values.searchText !== "" || changed.current === true) {
      changed.current = true;
      debouncedSubmit();
    }
  }, [debouncedSubmit, formik.values]);

  return null;
};

export default AutoSave;

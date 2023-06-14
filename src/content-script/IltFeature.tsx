import React, { useEffect, useRef, useState } from 'react';
import { ILT_ENABLED_CLASS } from '../common/constants';
import { Hovercard } from '../ui/Hovercard';
import { EditButton } from './EditButton';
import { findIlt } from './find-ilt';
import { useLengthState } from './hooks/useLengthState';
import { IltEditor } from './IltEditor';
import { FeatureProps } from './IltApp';

export const IltFeature = ({ onError }: FeatureProps) => {
  const [buttonSpans, setButtonSpans] = useLengthState<HTMLElement>([]);
  const [currentAnchor, setCurrentAnchor] = useState<HTMLElement | null>(null);
  const [iltDataError, setIltDataError] = useState<Error>();
  const [isIltEditorLoading, setIsIltEditorLoading] = useState<boolean>(true);
  const [iltData, setIltData] = useState<any>();
  const timeoutCallbackRef = useRef<(span: HTMLElement) => void>();
  const mouseoverCallbackRef = useRef<(span: HTMLElement) => void>();

  useEffect(() => {
    timeoutCallbackRef.current = (span: HTMLElement) => {
      setButtonSpans(buttonSpans.filter((sp) => sp !== span));
    };
    mouseoverCallbackRef.current = (span: HTMLElement) => {
      setButtonSpans([...buttonSpans.filter((sp) => sp !== span), span]);
    };
  });

  useEffect(() => {
    const intervals: Array<number> = [];
    intervals.push(findIlt(true));
    return () => {
      intervals.forEach((interval) => window.clearInterval(interval));
    };
  }, []);

  useEffect(() => {
    const mouseOverListener = (e: Event) => {
      // console.log('mouse over event: ', e);
      // e.stopImmediatePropagation();
      const testNode = e.target as HTMLElement;
      const span = testNode.closest(`.${ILT_ENABLED_CLASS}`) as HTMLElement;
      if (span) {
        mouseoverCallbackRef.current(span);
        const timeoutId = span.dataset.iltTimeoutId;
        if (timeoutId) {
          window.clearTimeout(parseInt(timeoutId));
        }
      }
    };

    const mouseOutListener = (e: Event) => {
      // console.log('mouse out event: ', e);
      // e.stopImmediatePropagation();
      const testNode = e.target as HTMLElement;
      const span = testNode.closest(`.${ILT_ENABLED_CLASS}`) as HTMLElement;
      if (span) {
        const timeoutId = setTimeout(() => {
          timeoutCallbackRef.current(span);
          span.removeAttribute('data-ilt-timeout-id');
        }, 1000);
        span.setAttribute('data-ilt-timeout-id', `${timeoutId}`);
      }
    };

    document.body.addEventListener('mouseover', mouseOverListener);
    document.body.addEventListener('mouseout', mouseOutListener);

    return () => {
      document.body.removeEventListener('mouseover', mouseOverListener);
      document.body.removeEventListener('mouseout', mouseOutListener);
    };
  }, []);

  const removeButtonFromSpan = (span: HTMLElement) => {
    setButtonSpans(buttonSpans.filter((sp) => sp !== span));
  };

  useEffect(() => {
    let initialIltData: any;
    if (currentAnchor) {
      try {
        initialIltData = currentAnchor ? currentAnchor.dataset.source : {};
      } catch (error) {
        setIltDataError(error);
        onError(new Error(`ILT Data Error\n\n${error.message}`));
        setIltData(null);
        return;
      }
      setIltData(initialIltData);
    } else {
      // When an editor is closed, `currentAnchor` will be undefined, so clear out
      // the data from the editor that was just closed.
      setIltData(null);
    }
  }, [currentAnchor]);

  return (
    <>
      {/* Currently open ILT Editor */}
      {currentAnchor && (
        <Hovercard
          target={currentAnchor}
          shiftPosition={true}
          onSelfClose={() => setCurrentAnchor(null)}
        >
          {iltDataError ? (
            <DataError
              warning="The data provided for this string is not valid JSON. Please fix this data before continuing:"
              error={iltDataError}
            />
          ) : (
            <IltEditor
              data={currentAnchor.dataset.fingerprint}
              setCurrentAnchor={setCurrentAnchor}
              setIsIltEditorLoading={setIsIltEditorLoading}
              isIltEditorLoading={isIltEditorLoading}
            />
          )}
        </Hovercard>
      )}

      {/* Buttons for hovered copy spans */}
      {buttonSpans
        .filter((span) => span !== currentAnchor)
        .map((span) => {
          return (
            <Hovercard
              target={span}
              key={JSON.stringify(span.dataset)}
              shiftPosition={true}
              onSelfClose={() => removeButtonFromSpan(span)}
            >
              <EditButton
                anchor={span}
                onRemoveButton={removeButtonFromSpan}
                setCurrentAnchor={setCurrentAnchor}
              />
            </Hovercard>
          );
        })}
    </>
  );
};

const DataError = ({ warning, error }: { warning: string; error: Error }) => {
  return (
    <>
      <div className="tw-text-red-700 tw-font-semibold tw-mb-3">{warning}</div>
      <code className="tw-whitespace-pre-wrap">{error.message}</code>
    </>
  );
};

import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from 'react';
import InlineTextarea from '../ui/InlineTextarea';
import { fetchTranslationData } from '../ilt/api';
import { removePreview, showPreview } from './show-preview';
import {
  DEBOUNCE_TIMEOUT,
  groupLinks,
  HTTP,
  INLINE_TRANSLATION_PROPOSAL,
  INLINE_TRANSLATION_VALIDATION,
  WIDGET_TIMEOUT,
  XMESSAGE_ERROR_DOC,
} from '../common/constants';
import { getCsrfToken } from '../common/csrfToken';
import { getEnvFromUrl } from '../common/environment';
import { getEnvFromStorage } from '../common/sessionStorage';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { findUrnMember, getLocal } from '../common/utils';
import Draggable from 'react-draggable';

interface IltEditorProps {
  data: string;
  setCurrentAnchor: (anchor: HTMLElement | null) => void;
  setIsIltEditorLoading: Dispatch<SetStateAction<boolean>>;
  isIltEditorLoading: boolean;
}

interface BoundsProps {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

export const IltEditor = ({
  data,
  setCurrentAnchor,
  setIsIltEditorLoading,
  isIltEditorLoading,
}: IltEditorProps) => {
  const [sourceTranslation, setSourceTranslation] = useState('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<string>();
  const [errorCode, setErrorCode] = useState<string>();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [author, setAuthor] = useState<string>();
  const [isEnglishSamplesExpanded, setIsEnglishSamplesExpanded] = useState(true);
  const [isTranslationSamplesExpanded, setIsTranslationSamplesExpanded] = useState(true);
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [groupLink, setGroupLink] = useState<string>();
  const [targetTranslation, setTargetTranslation] = useState<string | undefined>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const validationTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isPreviewDisabled = !targetTranslation || isError;
  const [bounds, setBounds] = useState<BoundsProps>({});
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);

  const handleTargetTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTargetTranslation(value);
    clearTimeout(validationTimerRef.current);
    validationTimerRef.current = setTimeout(() => {
      validateTargetTranslation(value);
    }, DEBOUNCE_TIMEOUT);
    // Remove preview and reset target translation if in preview mode
    if (isPreviewMode) {
      removePreview(getLocal());
      setIsPreviewMode(false);
    }
  };

  const handleCreateTranslation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const value = targetTranslation;
    createTranslation(value);
  };

  const createTranslation = async (translation: string) => {
    const locale = getLocal(); // e.g. "de_DE"
    const [language, country] = locale.split('_'); //'(language:de,country:DE)'
    // create the proposal
    const env = getEnvFromStorage() || (await getEnvFromUrl());
    const proposalUrl = `${INLINE_TRANSLATION_PROPOSAL[env]}`;
    try {
      const response = await fetch(proposalUrl, {
        headers: {
          ...HTTP.DEFAULT_HEADERS,
          'Csrf-Token': await getCsrfToken(),
        },
        method: 'POST',
        body: JSON.stringify({
          fingerprint: data,
          targetLocale: {
            language: language.toLowerCase(),
            country: country.toUpperCase(),
          },
          targetTranslation: translation,
          author: author,
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }
      setShowSuccessMessage(true);
      setTimeout(() => {
        setCurrentAnchor(null); // Close the widget after a delay
      }, WIDGET_TIMEOUT);
      // Process responseData as needed
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const validateTargetTranslation = async (translation: string) => {
    try {
      const locale = getLocal(); // e.g. "de_DE"
      const [language, country] = locale.split('_');
      const env = getEnvFromStorage() || (await getEnvFromUrl());
      const validationUrl = `${INLINE_TRANSLATION_VALIDATION[env]}`;

      const response = await fetch(validationUrl, {
        headers: {
          ...HTTP.DEFAULT_HEADERS,
          'Csrf-Token': await getCsrfToken(),
        },
        method: 'POST',
        body: JSON.stringify({
          proposal: {
            fingerprint: data,
            targetLocale: {
              language: language.toLowerCase(),
              country: country.toUpperCase(),
            },
            targetTranslation: translation,
            author: author,
          },
        }),
      });

      const responseData = await response.json();
      const issue = responseData.value.issues[0] ?? {};
      const isError = responseData.value.issues.length > 0;

      setIsError(isError);
      setErrorCode(isError ? issue.id : '');
      setMessage(isError ? issue.message : '');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Clear the timer when the component unmounts
    return () => {
      clearTimeout(validationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setIsIltEditorLoading(isIltEditorLoading);
    return () => {
      setIsIltEditorLoading(true);
    };
  }, [isIltEditorLoading]);

  const handleEnglishSamplesExpandCollapse = () => {
    setIsEnglishSamplesExpanded(!isEnglishSamplesExpanded);
  };

  const handleTranslationSamplesExpandCollapse = () => {
    setIsTranslationSamplesExpanded(!isTranslationSamplesExpanded);
  };

  const handlePreview = () => {
    if (isPreviewMode) {
      removePreview(getLocal());
    } else {
      const targetProposalValue = (
        document.getElementById('ilt-editor-proposal') as HTMLInputElement
      ).value;
      showPreview(targetProposalValue, data, getLocal());
    }
    setIsPreviewMode(!isPreviewMode);
  };

  useLayoutEffect(() => {
    const click = async (fingerprint: string) => {
      const locale = getLocal(); // e.g. "de_DE"

      if (locale === 'en_US') {
        setIsEnglish(true);
      }

      const [language, country] = locale.split('_'); //'(language:de,country:DE)'
      const interfaceLocale = `(language:${language.toLowerCase()},country:${country.toUpperCase()})`;
      const author = findUrnMember(
        JSON.parse(document.querySelector('meta[name="__init"]')?.getAttribute('content'))
      );
      setAuthor(author);

      try {
        setIsIltEditorLoading(true);
        const data = await fetchTranslationData(fingerprint, interfaceLocale);
        const fetchedProposals = data.proposals;
        setProposals(fetchedProposals);
        setIsAuthorizedUser(true);
        setIsIltEditorLoading(false);
        setTargetTranslation(
          fetchedProposals.find((proposal) => proposal.author === author)?.targetTranslation
        );
        return data.sourceTranslation;
      } catch (error) {
        setIsAuthorizedUser(false);
        setIsIltEditorLoading(false);
        const groupLink = groupLinks[locale];
        if (groupLink) {
          setGroupLink(groupLink);
        }
      }
    };
    const fetchSourceData = async () => {
      const result = await click(data);
      setSourceTranslation(result);
    };
    fetchSourceData();
  }, [data]);

  useEffect(() => {
    if (!isIltEditorLoading && draggableContainerRef.current) {
      const boundingClientRect = draggableContainerRef.current.getBoundingClientRect();
      const bounds = {
        left: -1 * boundingClientRect.left,
        right: window.innerWidth - boundingClientRect.right - 20, // adding extra margin to make sure staying within the viewport
        top: -1 * boundingClientRect.top,
        bottom: window.innerHeight - boundingClientRect.bottom,
      };
      setBounds(bounds);
    }
    return () => {
      setBounds({});
    };
  }, [draggableContainerRef.current, isIltEditorLoading]);

  if (isIltEditorLoading) {
    return (
      <>
        <div className="tw-flex tw-items-center tw-justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <Draggable handle="#draggableArea" bounds={bounds}>
      <div
        ref={draggableContainerRef}
        className="tw-border tw-border-warm-gray-400 tw-m-4 tw-p-4 tw-w-[552px] tw-drop-shadow-2xl tw-font-sans"
      >
        <div id="draggableArea" className="tw-bg-blue-800 tw-text-white tw-p-2 tw-cursor-move">
          Translate LinkedIn
        </div>
        {isAuthorizedUser ? (
          <div className="container">
            <div className="tw-bg-warm-gray-200 tw-border tw-border-solid tw-border-warm-gray-400 tw-border-b-0 tw-py-1 tw-px-3">
              <div className="tw-font-bold tw-my-2">English</div>
              <InlineTextarea
                value={sourceTranslation}
                id={'ilt-editor-source'}
                className="tw-resize-none tw-w-full tw-bg-white tw-text-warm-gray-600"
              ></InlineTextarea>
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-text-warm-gray-600">Variants</div>
                <div className="tw-cursor-pointer" onClick={handleEnglishSamplesExpandCollapse}>
                  {isEnglishSamplesExpanded ? (
                    <React.Fragment>&#x25B2;</React.Fragment>
                  ) : (
                    <React.Fragment>&#x25BC;</React.Fragment>
                  )}
                </div>
              </div>
              {isEnglishSamplesExpanded && (
                <ul className="tw-bg-white tw-border tw-border-solid tw-border-warm-gray-300 tw-mt-1 tw-h-36 tw-min-h-36 tw-max-h-60 tw-overflow-y-scroll tw-pl-6 tw-pt-2 tw-resize-y">
                  <li>You have 1 connection</li>
                  <li>You have 5 connections</li>
                  <li>You have 50+ connections</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                </ul>
              )}
            </div>

            <div className="tw-bg-white tw-border tw-border-solid tw-border-warm-gray-400 tw-py-1.5 tw-px-3">
              <div className="tw-font-bold tw-my-2">Translation</div>
              <div className="tw-flex">
                <div className="tw-w-full">
                  <InlineTextarea
                    key="target"
                    id="ilt-editor-proposal"
                    onChange={handleTargetTranslationChange}
                    value={targetTranslation}
                    className="tw-resize-none tw-w-full tw-bg-yellow-100"
                  />
                  {isError && (
                    <span className="tw-text-red-700 tw-font-semibold">
                      <div>
                        {message} Please refer to the documentation{' '}
                        <a
                          href={`${XMESSAGE_ERROR_DOC}/${errorCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          here{' '}
                        </a>
                        for more information.
                      </div>
                    </span>
                  )}
                </div>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-text-warm-gray-600">Variants</div>
                <div className="tw-cursor-pointer" onClick={handleTranslationSamplesExpandCollapse}>
                  {isTranslationSamplesExpanded ? (
                    <React.Fragment>&#x25B2;</React.Fragment>
                  ) : (
                    <React.Fragment>&#x25BC;</React.Fragment>
                  )}
                </div>
              </div>
              {isTranslationSamplesExpanded && (
                <ul className="tw-bg-white tw-border tw-border-solid tw-border-warm-gray-300 tw-mt-1 tw-h-36 tw-min-h-36 tw-max-h-60 tw-overflow-y-scroll tw-pl-6 tw-pt-2 tw-resize-y">
                  <li>Sie haben 1 Verbindung</li>
                  <li>Sie haben 5 Verbindungen</li>
                  <li>Sie haben 50+ Verbindungen</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                  <li>You have ...</li>
                </ul>
              )}
            </div>
            <div className="tw-pb-4 tw-pt-4">
              <div className="tw-flex tw-justify-between">
                <button
                  className={`tw-min-w-6 tw-py-2 tw-px-4 tw-rounded-sm ${
                    isPreviewDisabled
                      ? 'tw-bg-warm-gray-400 tw-text-warm-gray-700'
                      : 'tw-bg-green-500 tw-text-white'
                  }`}
                  onClick={handlePreview}
                  disabled={isPreviewDisabled}
                >
                  Preview
                </button>
                <div>
                  <div>
                    <button
                      className="tw-min-w-6 tw-bg-blue-900 tw-text-white tw-py-2 tw-px-4 tw-rounded-sm"
                      type="submit"
                      onClick={handleCreateTranslation}
                    >
                      Save
                    </button>
                    <button
                      className="tw-min-w-6 tw-bg-white tw-text-warm-gray-900 tw-py-2 tw-px-4 tw-rounded-sm"
                      onClick={() => setCurrentAnchor(null)}
                    >
                      Cancel
                    </button>
                  </div>
                  {showSuccessMessage && (
                    <div className="tw-text-green-700 tw-text-sm">
                      Translation successfully submitted!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="tw-font-bold tw-my-2">Proposals</div>
            <ul className="tw-border tw-border-solid tw-border-warm-gray-300 tw-h-36 tw-min-h-32 tw-max-h-60 tw-overflow-y-scroll tw-pl-0 tw-resize-y">
              {proposals
                .filter((proposal) => proposal.author !== author)
                .map((proposal, index) => (
                  <li key={index} className={`tw-mt-1 ${index > 0 ? 'tw-border-t' : ''}`}>
                    <div>
                      <ul className="tw-list-none tw-ml-0 tw-pl-6 tw-pr-6 tw-mt-2 tw-space-y-1">
                        {/* We will replace it with actual variants. See INT-92258. */}
                        {[...Array(3)].map((_, variantIndex) => (
                          <li key={variantIndex} className="tw-relative tw-pl-6">
                            <span className="tw-absolute tw-left-0 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-w-2 tw-h-2 tw-border tw-border-solid tw-border-black tw-rounded-full tw-bg-transparent"></span>
                            {proposal.targetTranslation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="container">
            <div className="tw-bg-warm-gray-200 tw-border tw-border-solid tw-border-warm-gray-400 tw-border-b-0 tw-py-1 tw-px-3">
              <div className="tw-font-bold tw-my-2">
                {isEnglish ? (
                  'You are not allowed to select English. Please select other language to use Inline Translation Extension for translation.'
                ) : (
                  <>
                    You are not authorized for the current language. You need to join the language
                    group first.{' '}
                    <a href={groupLink} target="_blank">
                      Click here
                    </a>{' '}
                    to join.
                  </>
                )}
                <div className="tw-pb-4 tw-pt-4 tw-text-right">
                  <button
                    className="tw-min-w-6 tw-bg-white tw-text-warm-gray-900 tw-py-2 tw-px-4 tw-rounded-sm"
                    onClick={() => setCurrentAnchor(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

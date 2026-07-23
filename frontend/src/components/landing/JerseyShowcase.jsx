import { useState } from 'react';
import heroImage from '../../assets/images/vestro.png';
import { Container, SectionHeading } from '../ui/index.js';

const viewOptions = [
  { label: 'Front', value: 'front' },
  { label: 'Back', value: 'back' },
  { label: '360°', value: '360' },
];

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function JerseyPreview({ label, position, isActive, isDimmed, className = '' }) {
  return (
    <figure className={`relative ${className}`}>
      <div
        className={joinClasses(
          'overflow-hidden rounded-2xl border bg-vestro-secondary shadow-vestro-md transition duration-200',
          isActive ? 'border-vestro-gold/70 shadow-vestro-gold' : 'border-vestro-border',
          isDimmed && 'opacity-55',
        )}
      >
        <img
          src={heroImage}
          alt={`${label} VESTRO jersey preview`}
          className={`aspect-[3/4] h-full w-full object-cover ${position}`}
        />
      </div>
      <figcaption className="mt-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light">
        {label}
      </figcaption>
    </figure>
  );
}

function JerseyShowcase() {
  const [viewMode, setViewMode] = useState('front');
  const isFrontActive = viewMode === 'front';
  const isBackActive = viewMode === 'back';
  const isPlaceholder360 = viewMode === '360';

  return (
    <section id="products" className="bg-vestro-page py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Jersey preview"
              title="Front and back kit previews for confident team approvals."
              description="Use this section for the dedicated jersey showcase as the landing page grows."
            />

            <div className="mt-8 inline-flex rounded-2xl border border-vestro-border bg-vestro-card p-1" aria-label="Jersey view controls">
              {viewOptions.map((option) => {
                const isSelected = viewMode === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setViewMode(option.value)}
                    className={joinClasses(
                      'rounded-xl px-4 py-2 text-sm font-bold transition duration-200 focus-visible:outline-vestro-gold',
                      isSelected
                        ? 'bg-vestro-gold text-vestro-page shadow-vestro-sm'
                        : 'text-vestro-muted hover:bg-vestro-gold/10 hover:text-vestro-gold-light',
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[30rem] overflow-hidden rounded-2xl border border-vestro-border bg-vestro-card px-5 pb-8 pt-10 shadow-vestro-md sm:min-h-[36rem] sm:px-8 lg:min-h-[40rem]">
            <div className="absolute left-1/2 top-[12%] h-64 w-64 -translate-x-1/2 rounded-full bg-vestro-gold/10 blur-3xl" />
            <div className="absolute bottom-10 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-full bg-vestro-gold/12 blur-xl" />
            {isPlaceholder360 && (
              <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-vestro-gold/35 bg-vestro-page/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-vestro-gold-light">
                360 view placeholder
              </div>
            )}

            <div className="relative mx-auto flex max-w-3xl items-end justify-center">
              <JerseyPreview
                label="Back"
                position="object-[74%_50%]"
                isActive={isBackActive}
                isDimmed={isFrontActive}
                className={joinClasses(
                  'absolute right-[4%] top-8 w-[48%] sm:right-[9%] sm:w-[44%] lg:top-10',
                  isBackActive ? 'z-20 opacity-100' : 'opacity-90',
                )}
              />
              <JerseyPreview
                label="Front"
                position="object-[28%_50%]"
                isActive={isFrontActive}
                isDimmed={isBackActive}
                className={joinClasses(
                  'relative mt-8 w-[56%] sm:w-[50%]',
                  isBackActive ? 'z-10' : 'z-20',
                )}
              />
            </div>

            <div className="absolute bottom-8 left-1/2 h-4 w-[52%] -translate-x-1/2 rounded-full border border-vestro-gold/20 bg-gradient-to-r from-transparent via-vestro-gold/25 to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default JerseyShowcase;

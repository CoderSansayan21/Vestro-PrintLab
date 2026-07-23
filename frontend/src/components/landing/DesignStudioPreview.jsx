import jerseyImage from '../../assets/images/vestro.png';
import { Container, PrimaryButton, SecondaryButton } from '../ui/index.js';

const workflowSteps = [
  {
    title: 'Upload Logo',
    icon: 'upload',
  },
  {
    title: 'Choose Colors',
    icon: 'palette',
  },
  {
    title: 'Add Name & Number',
    icon: 'type',
  },
  {
    title: 'Live Preview',
    icon: 'eye',
  },
  {
    title: 'Ready to Print',
    icon: 'print',
  },
];

const customizationSummary = [
  { label: 'Team', value: 'VESTRO' },
  { label: 'Player', value: 'John Smith' },
  { label: 'Number', value: '10' },
  { label: 'Primary Color', value: 'Black' },
  { label: 'Accent', value: 'Gold' },
];

const previewStatus = ['AI Ready', 'Print Ready', 'HD Preview'];

const iconPaths = {
  upload: 'M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 15v3.5h14V15',
  palette: 'M12 4a8 8 0 0 0-3.2 15.33c.82.34 1.7-.24 1.7-1.13v-.95c0-.69.56-1.25 1.25-1.25H13a7 7 0 0 0 7-7c0-2.76-3.58-5-8-5ZM8.2 10.2h.01M10.5 7.8h.01M14 7.8h.01M15.8 10.5h.01',
  type: 'M5 5h14M12 5v14M8.5 19h7',
  eye: 'M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Zm8 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z',
  print: 'M7 8V4h10v4M7 17H5v-6h14v6h-2M7 14h10v6H7v-6Z',
};

function WorkflowIcon({ type }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d={iconPaths[type]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DesignStudioPreview() {
  return (
    <section id="design-studio" aria-labelledby="design-studio-title" className="bg-vestro-page py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10">
          <div className="rounded-2xl border border-vestro-border bg-vestro-card p-6 shadow-vestro-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
              AI Design Studio
            </p>
            <h2 id="design-studio-title" className="mt-3 text-3xl font-black leading-tight text-vestro-text sm:text-4xl">
              Design Like a Professional in Minutes
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-vestro-muted">
              Create your dream sports jersey with AI-powered tools, live previews, and seamless customization.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton as="a" href="#how-it-works">
                Start Designing
              </PrimaryButton>
              <SecondaryButton as="a" href="#features">
                Learn More
              </SecondaryButton>
            </div>

            <div className="mt-8 space-y-4">
              {workflowSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-4 rounded-2xl border border-vestro-border bg-vestro-elevated/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold/35 sm:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-vestro-gold/35 bg-vestro-gold/10 text-sm font-black text-vestro-gold-light">
                    <WorkflowIcon type={step.icon} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-vestro-gold-light">
                      Step {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-vestro-text">
                      {step.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-vestro-border bg-vestro-card p-4 shadow-vestro-md sm:p-5">
            <div className="rounded-xl border border-vestro-gold/20 bg-vestro-page p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light">
                    Live preview
                  </p>
                  <h3 className="mt-1 text-xl font-black text-vestro-text">
                    Championship Kit
                  </h3>
                </div>
                <span className="w-fit rounded-full border border-vestro-gold/30 bg-vestro-gold/10 px-3 py-1 text-xs font-bold text-vestro-gold-light">
                  Draft
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                <div className="rounded-2xl border border-vestro-border bg-vestro-card p-3">
                  <img
                    src={jerseyImage}
                    alt="AI design studio jersey preview"
                    className="aspect-[4/5] w-full rounded-xl object-cover"
                  />
                </div>

                <div className="rounded-2xl border border-vestro-border bg-vestro-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-vestro-gold-light">
                    Customization summary
                  </p>
                  <dl className="mt-4 space-y-3">
                    {customizationSummary.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-4 border-b border-vestro-border pb-3 last:border-b-0 last:pb-0">
                        <dt className="text-sm text-vestro-muted">{item.label}:</dt>
                        <dd className="text-sm font-black text-vestro-text">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {previewStatus.map((status) => (
                  <div
                    key={status}
                    className="rounded-xl border border-vestro-gold/25 bg-vestro-gold/10 px-3 py-3 text-sm font-bold text-vestro-gold-light"
                  >
                    <span aria-hidden="true">✓</span> {status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default DesignStudioPreview;

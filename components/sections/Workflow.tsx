// Step-by-step project workflow.

import { company } from '@/lib/site-data';
import { SectionHead } from '@/components/ui/SectionHead';

export function Workflow() {
  return (
    <section className="section" id="workflow">
      <div className="container">
        <SectionHead
          eyebrow="Маршрут объекта"
          title={company.workflow.title}
          text={company.workflow.text}
          titleId="workflow-title"
          textId="workflow-text"
        />
        <ol className="workflow" data-workflow>
          {company.workflow.steps.map((step, index) => (
            <li className="workflow-step" key={step.title}>
              <div className="workflow-step__num" aria-hidden="true">
                {index + 1}
              </div>
              <div className="workflow-step__line" aria-hidden="true" />
              <div className="workflow-step__body">
                <h3 className="workflow-step__title">{step.title}</h3>
                <p className="workflow-step__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Translate, { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './styles.module.css';

interface FeatureItem {
  title: string;
  Svg: React.ReactNode;
  description: JSX.Element;
}

function BaseIcon({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.featureIcon}>
      {children}
    </div>
  );
}

/**
 * 类型安全图标 - 盾牌 + 检查标记
 */
function TypeSafetyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" />
    </svg>
  );
}

/**
 * 易于使用图标 - 上传/简单操作
 */
function EaseOfUseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 11H7l5-5 5 5h-2v7h-6v-7z" />
      <path d="M4 20h16v2H4z" />
    </svg>
  );
}

/**
 * 功能全面图标 - 星形/多功能
 */
function ComprehensiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.features.typesafe.title',
      message: 'Type Safe',
      description: 'The title of type safety feature',
    }),
    Svg: (
      <BaseIcon>
        <TypeSafetyIcon />
      </BaseIcon>
    ),
    description: (
      <Translate
        id="homepage.features.typesafe.description"
        description="The description of type safety feature"
      >
        Complete TypeScript support with intelligent type inference. Get full type safety from request to response, reducing runtime errors and improving development experience.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.easyuse.title',
      message: 'Easy to Use',
      description: 'The title of ease of use feature',
    }),
    Svg: (
      <BaseIcon>
        <EaseOfUseIcon />
      </BaseIcon>
    ),
    description: (
      <Translate
        id="homepage.features.easyuse.description"
        description="The description of ease of use feature"
      >
        Simple and intuitive API design. Get started in minutes with minimal configuration. Built-in best practices and sensible defaults for common use cases.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.comprehensive.title',
      message: 'Comprehensive',
      description: 'The title of comprehensive feature',
    }),
    Svg: (
      <BaseIcon>
        <ComprehensiveIcon />
      </BaseIcon>
    ),
    description: (
      <Translate
        id="homepage.features.comprehensive.description"
        description="The description of comprehensive feature"
      >
        Rich utility types for Objects, Arrays, Maps, and Sets. Powerful type transformations, filtering, and manipulation tools to handle complex data structures with ease.
      </Translate>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

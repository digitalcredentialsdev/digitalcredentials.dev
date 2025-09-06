import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'How To Issue and Request Credentials',
    Svg: require('@site/static/img/undraw_developer-avatar_f6ac.svg').default,
    description: (
      <>
        Developer guidance for issuing and verifying digital credentials using the Digital Credentials API and OpenID for Verifiable Presentations.
      </>
    ),
  },
  {
    title: 'Ecosystem Support',
    Svg: require('@site/static/img/undraw_in-sync_3wdt.svg').default,
    description: (
      <>
        Current support throughout the ecosystem.
      </>
    ),
  },
  {
    title: 'References, Tools, and Libraries',
    Svg: require('@site/static/img/undraw_dev-environment_n5by.svg').default,
    description: (
      <>
        Additional resources for implementing the Digital Credentials API and OpenID4VC.
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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

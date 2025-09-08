import React from 'react';
import Layout from '@theme/Layout';
import EcosystemSupportTable from '@site/src/components/EcosystemSupportTable';
import Heading from '@theme/Heading';

export default function EcosystemSupport() {
  return (
    <Layout
      title="Ecosystem Support"
      description="Browser and platform support for the Digital Credentials API.">
      <main className="container margin-vert--lg">
        <Heading as="h1">Ecosystem Support</Heading>
        <p>
          This page provides an overview of the support for the Digital Credentials API
          across different platforms and browsers.
        </p>
        <EcosystemSupportTable />
      </main>
    </Layout>
  );
}
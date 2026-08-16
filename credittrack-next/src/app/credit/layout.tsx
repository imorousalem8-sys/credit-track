import React from 'react';

export default function CreditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="credit-module">
      {children}
    </div>
  );
}

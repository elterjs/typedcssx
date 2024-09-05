'use client';

import Style, { max_lg } from 'typedcssx';

const styles = Style.create({
  e2e: {
    color: 'pink',
    [max_lg]: {
      color: 'aqua',
    },
  },
});

Style.global({
  h1: {
    color: 'aqua',
  },
});

export function E2ETest() {
  return (
    <div className={styles.e2e} data-testid="e2e-test-div">
      Component-attach-class and Responsive-design test
    </div>
  );
}
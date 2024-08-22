import Style from 'typedcssx';

const styles = Style.create({
  test_server: {
    color: 'green',
  },
});

export const ServerComponent = () => {
  return (
    <p className={styles.test_server} data-testid="e2e-test-p">
      ServerComponent
    </p>
  );
};

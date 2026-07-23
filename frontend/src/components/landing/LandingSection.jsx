function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function LandingSection({
  as: Component = 'section',
  children,
  className = '',
  contentClassName = '',
  padded = true,
  ...props
}) {
  return (
    <Component
      className={joinClasses(
        'relative bg-vestro-page text-vestro-text',
        padded && 'vestro-section-spacing',
        className,
      )}
      {...props}
    >
      <div className={joinClasses('vestro-section', contentClassName)}>{children}</div>
    </Component>
  );
}

export default LandingSection;

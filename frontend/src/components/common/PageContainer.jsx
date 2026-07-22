function PageContainer({ as: Component = 'main', children, className = '', contentClassName = '' }) {
  return (
    <Component className={`min-h-screen bg-vestro-page text-vestro-text ${className}`}>
      <div className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${contentClassName}`}>
        {children}
      </div>
    </Component>
  );
}

export default PageContainer;

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Container({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={joinClasses('vestro-section', className)} {...props}>
      {children}
    </Component>
  );
}

export default Container;

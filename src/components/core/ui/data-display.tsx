export const DataDisplay = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div>
      <div>
        <span className="text-muted text-transform: uppercase">{title}</span>
      </div>
      <div>
        <span className="text-transform: uppercase font-weight-bold">
          {content}
        </span>
      </div>
    </div>
  );
};

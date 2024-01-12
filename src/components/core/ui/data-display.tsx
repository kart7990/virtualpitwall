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
        <span className="uppercase text-muted">{title}</span>
      </div>
      <div>
        <span className="font-weight-bold uppercase">{content}</span>
      </div>
    </div>
  );
};

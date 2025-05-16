interface FolderProps {
  title: string;
}

const Folder = ({ title }: FolderProps) => {
  return (
    <div className="folder-card p-3 shadow">
      <h2>{title}</h2>
    </div>
  );
};

export default Folder;

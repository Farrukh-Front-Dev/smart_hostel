interface PeersHeaderProps {
  title: string;
  description: string;
}

export default function PeersHeader({ title, description }: PeersHeaderProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        {description}
      </p>
    </div>
  );
}

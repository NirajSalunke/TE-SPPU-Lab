export default function EmptyState({ title = 'Nothing here yet', description = '', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeInUp">
      {Icon && <Icon size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />}
      <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm">{description}</p>}
    </div>
  )
}

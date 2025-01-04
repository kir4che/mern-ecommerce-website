import Breadcrumb from '@/components/molecules/Breadcrumb'

interface PageHeaderProps {
  breadcrumbText: string
  titleEn: string
  titleCh: string
}

const PageHeader = ({ breadcrumbText, titleEn, titleCh }: PageHeaderProps) => {
  return (
    <div className="px-5 pt-4 md:px-8 min-h-40 bg-primary">
      <Breadcrumb text={breadcrumbText} textColor="text-secondary" />
      <h2 className="flex flex-col items-center justify-center gap-y-2 text-secondary">
        <span className="text-lg font-light tracking-wider">{titleEn}</span>
        <span className="text-2xl font-medium">{titleCh}</span>
      </h2>
    </div>
  )
}

export default PageHeader

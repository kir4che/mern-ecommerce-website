import type { FC, SVGProps } from "react";

interface SvgMockProps extends SVGProps<SVGSVGElement> {}

export const ReactComponent: FC<SvgMockProps> = (props) => <svg {...props} />;

export default "svg-mock";

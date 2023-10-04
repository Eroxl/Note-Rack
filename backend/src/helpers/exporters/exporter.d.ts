import type { IPage } from '../../models/pageModel';

type exporter = (page: IPage) => Promise<Buffer>;

export default exporter;

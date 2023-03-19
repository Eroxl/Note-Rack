import mongoose, { Schema } from 'mongoose';

export interface IPageMap {
  _id: string;
  pathToPage: string[];
}

const PageMapScheme = new Schema<IPageMap>({
  _id: Schema.Types.String,
  pathToPage: [Schema.Types.String],
});

const PageMapModel = mongoose.models.pageMap as mongoose.Model<IPageMap> || mongoose.model<IPageMap>('pageMap', PageMapScheme);

export default PageMapModel;

import mongoose, { Schema } from 'mongoose';

interface IPageTree {
  _id: string;
  expanded: boolean;
  style: {};
  subPages: IPageTree[];
}

const PageTreeSchema = new Schema<IPageTree>({});

PageTreeSchema.add({
  _id: Schema.Types.String,
  expanded: Schema.Types.Boolean,
  style: {},
  subPages: [PageTreeSchema],
});

const PageTreeModel = mongoose.models.pageTree as mongoose.Model<IPageTree> || mongoose.model<IPageTree>('pageTree', PageTreeSchema);

export default PageTreeModel;

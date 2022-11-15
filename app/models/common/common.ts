import { applySnapshot, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import Reactotron from "reactotron-react-native"

/**
 * Model description here for TypeScript hints.
 */




export const CommonModel = types
  .model("Common")
  .props({
    image: types.optional(types.array(types.string), []),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    reset: () => {
      applySnapshot(self, {})
    },
    setImage: (image:string[]) => {
      // @ts-ignore
      self.image = [...self.image, ...image]
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Common extends Instance<typeof CommonModel> {
}

export interface CommonSnapshotOut extends SnapshotOut<typeof CommonModel> {
}

export interface CommonSnapshotIn extends SnapshotIn<typeof CommonModel> {
}

export const createCommonDefaultModel = () => types.optional(CommonModel, {})

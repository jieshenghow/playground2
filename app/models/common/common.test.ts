import { CommonModel } from "./Common"

test("can be created", () => {
  const instance = CommonModel.create({})

  expect(instance).toBeTruthy()
})

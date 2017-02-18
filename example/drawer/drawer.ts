/**
 * Created by tushar on 18/02/17.
 */
import {create} from '../../index'
import {Action} from 'hoe'


interface DrawerModel {
  startX: number
  currentX: number
  isMoving: boolean
}

function init (): DrawerModel {
  return {
    startX: 0,
    currentX: 0,
    isMoving: false
  }
}

function scan (action: Action<any>, memory: DrawerModel = init()) {
  console.log(action)
}

export const Drawer = create(scan as any)
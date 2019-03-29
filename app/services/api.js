import { stringify } from 'qs'
import request from '../utils/request'
import  Host  from '../utils/host'

const { host } = Host


export async function queryMenu() {
    return request(`${host}/api/stop_or_start/`)
  }
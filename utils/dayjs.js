import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/zh-cn"

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(timezone)

dayjs.locale("zh-cn")

export default dayjs

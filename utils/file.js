/**
 * 获取文件后缀
 *
 * @param {string} filename
 * @returns {string} 文件后缀名，例如：png。
 */
export function getFileExtension(filename) {
    if (filename && filename.includes('.') && filename.lastIndexOf('.') !== 0) {
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
    return '';
}

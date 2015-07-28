#ifndef _Included_NativeStringUtil
#define _Included_NativeStringUtil
#ifdef __cplusplus
extern "C" {
#endif
char *jbyteArray2cstr( JNIEnv *env, jbyteArray javaBytes );
void jbyteArray2cstr2( JNIEnv *env, jbyteArray javaBytes, char *cstr, size_t maxlen );
jbyteArray cstr2jbyteArray( JNIEnv *env, const char *nativeStr);
jbyteArray javaGetBytes( JNIEnv *env, jstring str );
jbyteArray javaGetBytesEncoding( JNIEnv *env, jstring str, const char *encoding );
jstring javaNewString( JNIEnv *env, jbyteArray javaBytes );
jstring javaNewStringEncoding(
    JNIEnv *env, jbyteArray javaBytes, const char *encoding );
#ifdef __cplusplus
}
#endif
#endif


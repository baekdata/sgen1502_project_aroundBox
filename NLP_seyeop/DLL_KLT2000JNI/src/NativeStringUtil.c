/*
 * @(#)NativeStringUtil.c	1.0 98/01/02 Deogtae Kim (dtkim@calab.kaist.ac.kr)
 */

#include <stdlib.h>
#include <string.h>
#include <jni.h>
#include "NativeStringUtil.h"

/* 효율성을 높이기 위한 캐슁 변수 */
static jclass class_String;
static jmethodID mid_getBytes, mid_getBytesEncoding;
static jmethodID mid_newString, mid_newStringEncoding;


/* 자바 바이트 배열로부터 C 문자열을 생성하여 반환
 */
char *jbyteArray2cstr( JNIEnv *env, jbyteArray javaBytes )
{
    size_t len = (*env)->GetArrayLength(env, javaBytes);
    jbyte *nativeBytes = (*env)->GetByteArrayElements(env, javaBytes, 0);
    char *nativeStr = malloc(len+1);

    strncpy( nativeStr, nativeBytes, len );
    nativeStr[len] = '\0';
    (*env)->ReleaseByteArrayElements(env, javaBytes, nativeBytes, JNI_ABORT);
    return nativeStr;
}

void jbyteArray2cstr2( JNIEnv *env, jbyteArray javaBytes, char *cstr, size_t maxlen )
{
    size_t len = (*env)->GetArrayLength(env, javaBytes);
    jbyte *nativeBytes = (*env)->GetByteArrayElements(env, javaBytes, 0);
 
	if (len >= maxlen) len = maxlen - 1;
    strncpy( cstr, (char *)nativeBytes, len );
	cstr[len] = '\0';
    (*env)->ReleaseByteArrayElements(env, javaBytes, nativeBytes, JNI_ABORT);
}

/* C 문자열로부터 자바 바이트 배열을 생성하여 반환
 */
jbyteArray cstr2jbyteArray( JNIEnv *env, const char *nativeStr)
{
    jbyteArray javaBytes;
    int len = strlen( nativeStr );
    javaBytes = (*env)->NewByteArray(env, len);
    (*env)->SetByteArrayRegion(
        env, javaBytes, 0, len, (jbyte *) nativeStr );
    return javaBytes;
}


/* 자바 스트링을 디폴트 인코딩의 자바 바이트 배열로 변환.
 * String 클래스의 getBytes() 메쏘드를 호출한다.
 */
jbyteArray javaGetBytes( JNIEnv *env, jstring str )
{
    if ( mid_getBytes == 0 )
    {   if ( class_String == 0 )
        {   jclass cls = (*env)->FindClass(env, "java/lang/String");
            if ( cls == 0 ) 
                return 0;  /* 오류 */
            class_String = (*env)->NewGlobalRef(env, cls);
            if ( class_String == 0 ) 
                return 0;  /* 오류 */
        }
        mid_getBytes = (*env)->GetMethodID(
            env, class_String, "getBytes", "()[B");
        if (mid_getBytes == 0)
            return 0;
    }

    /* str.getBytes(); */
    return (*env)->CallObjectMethod( env, str, mid_getBytes );
}


/* 자바 스트링을 지정된 인코딩 `encoding'의 자바 바이트 배열로 변환.
 * String 클래스의 getBytes(String encoding) 메쏘드를 호출한다.
 */
jbyteArray javaGetBytesEncoding( JNIEnv *env, jstring str, const char *encoding )
{
    if ( mid_getBytesEncoding == 0 )
    {   if ( class_String == 0 )
        {   jclass cls = (*env)->FindClass(env, "java/lang/String");
            if ( cls == 0 ) 
                return 0;  /* 오류 */
            class_String = (*env)->NewGlobalRef(env, cls);
            if ( class_String == 0 ) 
                return 0;  /* 오류 */
        }
        mid_getBytesEncoding = (*env)->GetMethodID(
            env, class_String, "getBytes", "(Ljava/lang/String;)[B");
        if (mid_getBytesEncoding == 0)
            return 0;
    }

    /* str.getBytes( encoding ); */
    return (*env)->CallObjectMethod(
        env, str, mid_getBytesEncoding, (*env)->NewStringUTF(env, encoding));
}


/* 디폴트 인코딩의 자바 바이트 배열을 자바 스트링으로 변환.
 * String 클래스의 new String(byte[] bytes) 메쏘드를 호출한다.
 */
jstring javaNewString( JNIEnv *env, jbyteArray javaBytes )
{
    if ( mid_newString == 0 )
    {   if ( class_String == 0 )
        {   jclass cls = (*env)->FindClass(env, "java/lang/String");
            if ( cls == 0 ) 
                return 0;  /* 오류 */
            class_String = (*env)->NewGlobalRef(env, cls);
            if ( class_String == 0 ) 
                return 0;  /* 오류 */
        }
        mid_newString = (*env)->GetMethodID(
            env, class_String, "<init>", "([B)V");
        if ( mid_newString == 0 )
            return 0;
    }

    /* new String( javaBytes ); */
    return (*env)->NewObject(
        env, class_String, mid_newString, javaBytes );
}


/* 지정된 인코딩 `encoding'의 자바 바이트 배열을 자바 스트링으로 변환.
 * String 클래스의 new String(byte[] bytes, String encoding)
 * 메쏘드를 호출한다.
 */
jstring javaNewStringEncoding(
    JNIEnv *env, jbyteArray javaBytes, const char *encoding )
{
//    int len;
    jstring str;

    if ( mid_newString == 0 )
    {   if ( class_String == 0 )
        {   jclass cls = (*env)->FindClass(env, "java/lang/String");
            if ( cls == 0 ) 
                return 0;  /* 오류 */
            class_String = (*env)->NewGlobalRef(env, cls);
            if ( class_String == 0 ) 
                return 0;  /* 오류 */
        }
        mid_newString = (*env)->GetMethodID(
            env, class_String, "<init>", "([BLjava/lang/String;)V");
        if ( mid_newString == 0 )
            return 0;
    }

    /* new String( javaBytes, encoding ); */
    str = (*env)->NewObject(
        env, class_String, mid_newString, javaBytes,
        (*env)->NewStringUTF(env, encoding) );
    return str;
}


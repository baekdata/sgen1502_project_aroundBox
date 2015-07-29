#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

#include <jni.h>
#include "klt2000_kma_KLT2000JNI.h"
#include "NativeStringUtil.h"

//  �ѱ� ���¼� �м��⿡ ���� header ���� 
#include "../header/ham-ndx.h"

/* 'KeyMem', 'HamOut' is needed ONLY for THREAD-SAFE running */
unsigned char KeyMem[MAXKEYBYTES];	/* TEMPORARY MEMORY: keyword string */
HAM_MORES HamOut;	/* TEMPORARY MEMORY: morph. analysis result */
HAM_RUNMODE mode;			// running mode of HAM

/*
 * JavaJNI_klt2000_getstems
 * Java�κ��� �Է� ������ �޾� ���ξ �����Ͽ� Java string���� �����ϴ� �Լ�
 *
 * <parameters>
 * str - Java�κ��� ���޵Ǵ� �Է� ����
 * keywords - ����� ���ξ� �迭(blank�� ���еǾ� ����)
 */
JNIEXPORT jstring JNICALL Java_klt2000_kma_KLT2000JNI_getstems
	(JNIEnv *env, jobject obj, jstring str)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */
	char keywords[SENTSIZE*2];

	if (open_HAM_index(&mode, NULL, "./hdic/klt2000.ini")) {
		printf("Initialize error -- open_HAM_index()\n");
		return NULL;
	}

	jbyteArray2cstr2( env, javaGetBytes(env, str), (char *)sent, SENTSIZE );
//	n = get_stems(sent, term, &mode);
	n = get_stems_TS(sent, term, KeyMem, &HamOut, &mode);	/* thread-safe version of 'get_stems()' */

   if (n >= 1) {
		strcpy(keywords, term[0]);
    } else keywords[0] = '\0';
	for (i=1; i < n; i++) {
//		printf( "%d %s\n", nkeys, keys[i] );
		strcat(keywords," ");
		strcat(keywords, term[i]);
    }
//	printf("%s", keywords);

	close_HAM_index(&mode);	/* HAM is not used any more */

    /* ����Ʈ ���ڵ��� ����Ƽ�� ��Ʈ�� -> �ڹ� ��Ʈ�� */
	return javaNewString( env, cstr2jbyteArray(env, keywords) );
}

/*
 * JavaJNI_klt2000_getstems2
 * Java�κ��� ������ �޾� ���ξ� ����⸦ �̿��Ͽ� ���ξ �����ϰ� �̸� Java�� �ٽ� �����ϴ� �Լ�
 *
 * <parameters>
 * str - Java�κ��� ���޵Ǵ� ����
 * keywords - ����� ���ξ� �迭
 */
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_getstems2
	(JNIEnv * env, jobject obj, jstring str, jobjectArray keywords)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *terms[MAXKEYWORDS];	/* extracted keywords */

    if (open_HAM_index(&mode, NULL, "./hdic/klt2000.ini")) {
		printf("Initialize error -- open_HAM_index()\n");
		return 0;
	}

	// String�� cpp ������ char * �� ��ȯ
	jbyteArray2cstr2(env, javaGetBytes(env, str), (char*)sent, SENTSIZE);
	n = get_stems(sent, terms, &mode);

	for(i = 0; i < n; i++) {	// terms[i]�� Term ����
		jstring iArray = javaNewString(env, cstr2jbyteArray(env, (char *)terms[i]));
		(*env)->SetObjectArrayElement(env, keywords, i, iArray);
	}

	close_HAM_index(&mode);		// HAM is not used any more
	return n;	// number of terms
}

/*
 * Class:     KLT2000JNI
 * Method:    open_HAM_index
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_open_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	if (open_HAM_index(&mode, NULL, "C:\\Tmp\\test\\hdic\\KLT2000.ini")) {
        printf("Initialize error -- open_HAM_index()\n");
		return 1;
	} else return 0;
}

/*
 * Class:     KLT2000JNI
 * Method:    close_HAM_index
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_klt2000_kma_KLT2000JNI_close_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	close_HAM_index(&mode);		// HAM is not used any more
}

/*
 * Class:     KLT2000JNI
 * Method:    get_stems
 * Signature: (Ljava/lang/String;)Ljava/lang/String;
 */
JNIEXPORT jstring JNICALL Java_klt2000_kma_KLT2000JNI_get_1stems
  (JNIEnv *env, jobject obj, jstring str)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */
	char keywords[SENTSIZE*2];

	jbyteArray2cstr2( env, javaGetBytes(env, str), (char *)sent, SENTSIZE );
//	n = get_stems(sent, term, &mode);
	n = get_stems_TS(sent, term, KeyMem, &HamOut, &mode);	/* thread-safe version of 'get_stems()' */

   if (n >= 1) {
		strcpy(keywords, term[0]);
    } else keywords[0] = '\0';
	for (i=1; i < n; i++) {
		strcat(keywords," ");
		strcat(keywords, term[i]);
	}
	return javaNewString( env, cstr2jbyteArray(env, keywords) );
}

/*
 * Class:     KLT2000JNI
 * Method:    get_stems2
 * Signature: (Ljava/lang/String;[Ljava/lang/String;)I
 */
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_get_1stems2
  (JNIEnv *env, jobject obj, jstring str, jobjectArray keywords)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */

	// String�� cpp ������ char * �� ��ȯ
	jbyteArray2cstr2(env, javaGetBytes(env, str), (char*)sent, SENTSIZE);
	n = get_stems(sent, term, &mode);

	for(i = 0; i < n; i++) {	// term[i]�� Term ����
		jstring iArray = javaNewString(env, cstr2jbyteArray(env, (char *)term[i]));
		(*env)->SetObjectArrayElement(env, keywords, i, iArray);
	}

	return n;	// number of terms
}

/* �Է� ���� ��ü�� memory�� load */
unsigned char *load_text(fp)
FILE *fp;
{
	long n;
	unsigned char *p;

	fseek(fp, 0L, 2);
	n = ftell(fp);	/* n: byte size of file 'fp' */

	fseek(fp, 0L, 0);
	p = (unsigned char *) malloc(n+1);	/* memory allocation */
	if (p == NULL) return NULL;

	fread(p, sizeof(unsigned char), n, fp);	/* read 'fp' to 'p' */
	*(p+n) = '\0';

	return p;
}

/* ����� ��� ��� */
void put_terms(fp, term, n, ts)
FILE *fp;
HAM_TERMLIST term[];/* ����� ������ ���� ���̺� */
int n;				/* ����� ��� ���� */
unsigned char ts[];	/* ������ NULL ���� '\0'���� ���еǾ� ����Ǿ� �ִ� memory pool */
		/* ts[] --> "term1<null>term2<null>term3<null>...termN<null>" */
		/* term[i].offset --> ��� i�� ts[] ���� ��ġ�� ����Ű�� ���� */
{
	int i, j, nlocs;

	fprintf(fp, "----------------------------------------------------------------------\n");
	fprintf(fp, " No: Freq  Score  Term\t\t Loc1\t Loc2\t Loc3\t Loc4\t Loc5\n");
	fprintf(fp, "----------------------------------------------------------------------\n");

	for (i = 0; i < n; i++) {
		fprintf(fp, "%3d:%5u %6u  %s", i+1,
			term[i].tf,			/* ����� �󵵼� */
			term[i].score,		/* ����� ����ġ */
			ts+term[i].offset);	/* ts+term[i].offset : ��� ��Ʈ�� */

			if (strlen(ts+term[i].offset) < 6) fprintf(fp, "\t");	/* �� ���� */

		nlocs = (term[i].tf > MAX_LOCS_PER_TERM ? MAX_LOCS_PER_TERM : term[i].tf);
		for (j = 0; j < nlocs; j++)	/* ����� ��ġ���� �ִ� MAX_LOCS_PER_TERM �� */
			fprintf(fp, "\t%5u", term[i].loc[j]);
		fprintf(fp, "\n");
	}

	fprintf(fp, "----------------------------------------------------------------------\n");
}

/*========================== Global Variable ===========================*/
HAM_TERMLIST Term[MAX_TERMS_DOC];	/* extracted terms */
HAM_TERMMEMORY TM;	/* termtext.h: memories needed for term extraction */
/*======================================================================*/

/*
 * Class:     klt2000_kma_KLT2000JNI
 * Method:    get_terms_file
 * Signature: (Ljava/lang/String;Ljava/lang/String;)I
 */
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_get_1terms_1file
  (JNIEnv *env, jobject obj, jstring input_file, jstring output_file)
{
	unsigned char *text;	/* input text: �Է� ���� ��ü */
	unsigned char fname[BUFSIZ];	/* input word or sentence */
	FILE *fpin, *fpout;
	int n, n2=0;	/* number of terms */

	// String�� cpp ������ char * �� ��ȯ
	jbyteArray2cstr2(env, javaGetBytes(env, input_file), (char*)fname, SENTSIZE);
	fpin = fopen(fname, "r");
	if (fpin == NULL) return -1;
	jbyteArray2cstr2(env, javaGetBytes(env, output_file), (char*)fname, SENTSIZE);
	fpout= fopen(fname, "w");
	if (fpin == NULL) return -1;

	if ((text=load_text(fpin)) == NULL)	/* [����] 'fpin'�� "rb"�� open */
		return -1;	/* text file --> 'text' */
	n = get_terms_text(text, Term, &TM, &mode, n2, 3, 1);
	/*------------------------------------------------------------------------
		- �ټ���° ���� -- 0/n/-n(�ִ�� ����Ǵ� ����)
			n: �ִ� ���� ����, -n: �� n�̻�(or n �ۼ�Ʈ), 0: ��� ��� ����
			[����] n�� ���� ����: sortflag(���� ���)�� ���� '����ġ' or '���� �ɼ�'
			  - sortflag�� ��� 1/2/3/4 -- ����ġ ������ n�� ����
			  - sortflag�� ���� -1/-2/-3/-4 -- ���� ��Ŀ� ���� ���� �� n�� ����
			[����] n <= -10 �̸�, -n �ۼ�Ʈ��ŭ ������ �����.

		- ������° ���� -- 0/1/2/3/4(���� ���)
			0: ���� ����, 1: '������'��, 2: �󵵼�, 3: ����ġ, 4: ������ġ
			[����] n�� ���� ������ '���� ���'�� ���� �����Ϸ��� ������ ��

		- ������ ���� -- 0/1(������ġ numbering ���)
			0: ����������, 1: ���庰�� 100���� ����
	========================================================================*/

	put_terms(fpout, Term, n, TM.memTermString);

	free(text);	/* malloc() in 'load_text()' */
	fclose(fpin); fclose(fpout);

	return 0;
}
